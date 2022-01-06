import { I3DObject } from "./engine/data_formats/3d_object";
import { Material } from "./engine/material";
import { Game3DObject } from "./engine/objects/game3d_obj";
import { ShaderProgram } from "./engine/shader_program";
import { Game } from "./game";
import { GameLocale } from "./localization/locale";
import { LocalizationProvider } from "./localization/localization_provider";
import { OBJLoader } from "./engine/utils/objloader";
import { Animation, IKeyframe, KeyframeInterpolation } from "./engine/animations/animation";
import { Vec3 } from "./engine/data_formats/vec/vec3";

interface LoadList {
    locale_dir: string;
    locales: string[];

    shader_dir: string;
    shaders: {
        name: string;
        vert: string;
        frag: string;
    }[];

    game_object_dir: string;
    game_objects: {
        name: string;
        mesh: string;
        shader: string;
        material: string;
    }[];

    material_folder: string;
    materials: {
        name: string;
        folder: string;
        albedo: string;
        normal: string;
    }[];

    animation_folder: string;
    animations: string[];
}

interface LocaleSource {
    language: string;
    source: any;
}

interface ShaderProgramSource {
    name: string;
    vert: string;
    frag: string;
}

interface MaterialSource {
    name: string;
    albedo?: HTMLImageElement;
    normal?: HTMLImageElement;
}

interface GameObjectSource {
    name: string;
    objSource: I3DObject[];
    shader?: ShaderProgram;
    material: Material;
}

interface AnimationSource {
    name: string;
    keyframes: {
        delay: number;
        interpolation: string;
        position?: { x: number, y: number, z: number};
        rotation?: { x: number, y: number, z: number};
        scale?: { x: number, y: number, z: number};
    }[];
}

export enum LoadingState {
    FETCHING_LOAD_LIST = "fetch_load_list",
    LOADING_LOCALES = "loading_locales",
    CONSTRUCTING_LOCALES = "constructing_locales",
    LOADING_SHADERS = "loading_shaders",
    COMPILING_SHADERS = "compiling_shaders",
    LOADING_MATERIALS = "loading_materials",
    CONSTRUCTING_MATERIALS = "constructing_materials",
    LOADING_MODELS = "loading_models",
    INITIALIZING_MODELS = "constructing_models",
    LOADING_ANIMATIONS = "loading_animations",
    INITIALIZING_ANIMATIONS = "initializing_animations",
    FINISHED = "finished"
}

class Loader {

    private loadListFileName: string = "load_list.json";
    private loadList!: LoadList;
    private state: LoadingState = LoadingState.FETCHING_LOAD_LIST;

    private sourceLocales: LocaleSource[] = [];
    private sourceShaders: ShaderProgramSource[] = [];
    private sourceMaterials: MaterialSource[] = [];
    private sourceGameObjects: GameObjectSource[] = [];
    private sourceAnimations: AnimationSource[] = [];

    private loadedShaders: ShaderProgram[] = [];
    private loadedMaterials: Material[] = [];
    private loadedGameObjects: Game3DObject[] = [];

    private errorLoading: boolean = false;

    // Callbacks, to be set externally
    loadStateChangedCallback?: (newState: LoadingState, current: number, total: number) => void;
    loadFinishedCallback?: () => void;
    loadFailedCallback?: (partName: string) => void;

    load(): void {
        $.ajax({
            type: "GET",
            url: this.loadListFileName
        })
        .done((ret: LoadList) => {
            console.log('fetched load list:');
            console.log(ret);
            this.loadList = ret;
            this.nextStage();
        })
        .fail((jqXHR, textStatus, error) => {
            console.error("Failed to fetch load list, cannot load");
        });
    }

    private ajaxGet<Type>(file: string, callback: (ret: Type) => void) {
        $.ajax({
            type: "GET",
            url: file
        })
        .done((ret) => {
            if (this.errorLoading) return; // don't continue loading if there was an error
            callback(ret);
        })
        .fail((jqXHR, textStatus, error) => {
            console.error(`Failed loading ${file}: ${error}`);
            this.errorLoading = true;
            if (this.loadFailedCallback)
                this.loadFailedCallback(file);
        });
    }

    private ajaxGetImage(path: string, callback: (ret: HTMLImageElement) => void) {
        let image = new Image();
        image.onload = () => {
            callback(image);
        };
        image.src = path;
    }

    private triggerLoadStateChange() {
        if (this.loadStateChangedCallback)
            this.loadStateChangedCallback(this.state, Object.values(LoadingState).indexOf(this.state), Object.keys(LoadingState).length);
    }

    private nextStage() {
        if (this.errorLoading) return;
        switch (this.state) {
            case LoadingState.FETCHING_LOAD_LIST:
                console.log('fetched load list');
                this.state = LoadingState.LOADING_LOCALES;
                this.triggerLoadStateChange();
                this.loadLocales();
                break;
            case LoadingState.LOADING_LOCALES:
                console.log('loaded all locales');
                this.state = LoadingState.CONSTRUCTING_LOCALES;
                this.triggerLoadStateChange();
                this.constructLocales();
                break;
            case LoadingState.CONSTRUCTING_LOCALES:
                console.log('constructed locales');
                this.state = LoadingState.LOADING_SHADERS;
                this.triggerLoadStateChange();
                this.loadShaders();
                break;
            case LoadingState.LOADING_SHADERS:
                console.log('loaded all shaders');
                this.state = LoadingState.COMPILING_SHADERS;
                this.triggerLoadStateChange();
                this.constructShaders();
                break;
            case LoadingState.COMPILING_SHADERS:
                console.log('compiled all shaders');
                this.state = LoadingState.LOADING_MATERIALS;
                this.triggerLoadStateChange();
                this.loadMaterials();
                break;
            case LoadingState.LOADING_MATERIALS:
                console.log('loaded all materials');
                this.state = LoadingState.CONSTRUCTING_MATERIALS;
                this.triggerLoadStateChange();
                this.constructMaterials();
                break;
            case LoadingState.CONSTRUCTING_MATERIALS:
                console.log('constructed all materials');
                this.state = LoadingState.LOADING_MODELS;
                this.triggerLoadStateChange();
                this.loadModels();
                break;
            case LoadingState.LOADING_MODELS:
                console.log('all models loaded');
                this.state = LoadingState.INITIALIZING_MODELS;
                this.triggerLoadStateChange();
                this.initializeModels();
                break;
            case LoadingState.INITIALIZING_MODELS:
                console.log('all models initialized');
                this.state = LoadingState.LOADING_ANIMATIONS;
                this.triggerLoadStateChange();
                this.loadAnimations();
                break;
            case LoadingState.LOADING_ANIMATIONS:
                console.log('loaded all animations');
                this.state = LoadingState.INITIALIZING_ANIMATIONS;
                this.triggerLoadStateChange();
                this.registerAnimations();
                break;
            case LoadingState.INITIALIZING_ANIMATIONS:
                console.log('initialized all animations');
                this.state = LoadingState.FINISHED;
                this.triggerLoadStateChange();
                if (this.loadFinishedCallback)
                    this.loadFinishedCallback();
                break;
                
        }
    }

    /**
     *  1. Load and construct all locales
     */
    private loadLocales() {
        this.loadList.locales.forEach(locale => {
            this.ajaxGet(`${this.loadList.locale_dir}/${locale}`, (ret: LoadList) => {
                
                this.sourceLocales.push({
                    language: locale,
                    source: ret
                });

                console.log('loaded locale ' + locale + ' ' + this.sourceLocales.length + ' of ' + this.loadList.locales.length);

                if (this.sourceLocales.length == this.loadList.locales.length)
                    this.nextStage();
            });
        });
    }

    /**
     *  2. Initialize locale provider with all the loaded locales
     */
    private constructLocales() {
        LocalizationProvider.initialize(this.sourceLocales.map(s => new GameLocale(s.language, s.source)));
        this.nextStage();
    }

    /**
     *  3. Load shaders
     */
    private loadShaders() {

        let shadersLoaded = 0;
        let totalShaders = this.loadList.shaders.length;

        this.loadList.shaders.forEach(shader => {
            let vertSource: string = "";
            let fragSource: string = "";

            this.ajaxGet(`${this.loadList.shader_dir}/${shader.vert}`, (ret: string) => {
                vertSource = ret;
                console.log('loaded ' + shader.vert);
                if (vertSource != "" && fragSource != "") {
                    console.log('finished loading shader ' + shader.name);
                    shadersLoaded++;
                    this.sourceShaders.push({
                        name: shader.name,
                        vert: vertSource,
                        frag: fragSource
                    });
                    if (shadersLoaded == totalShaders)
                        this.nextStage();
                }
            });

            this.ajaxGet(`${this.loadList.shader_dir}/${shader.frag}`, (ret: string) => {
                fragSource = ret;
                console.log('loaded ' + shader.frag);
                if (vertSource != "" && fragSource != "") {
                    console.log('finished loading shader ' + shader.name);
                    shadersLoaded++;
                    this.sourceShaders.push({
                        name: shader.name,
                        vert: vertSource,
                        frag: fragSource
                    });
                    if (shadersLoaded == totalShaders)
                        this.nextStage();
                }
            });
        });
    }

    /**
     *  4. Compile the shaders
     */
    private constructShaders() {
        this.sourceShaders.forEach(ss => {
            this.loadedShaders.push(new ShaderProgram(ss.name, ss.vert, ss.frag));
        });
        this.nextStage();
    }

    /**
     *  5. Load Materials
     */
    private loadMaterials() {
        this.loadList.materials.forEach(mat => {

            const matSource: MaterialSource = { name: mat.name };

            this.ajaxGetImage(`${this.loadList.material_folder}/${mat.folder}/${mat.albedo}`, albedo => {
                matSource.albedo = albedo;
                this.checkMaterialLoadCompletion(matSource);
            });

            this.ajaxGetImage(`${this.loadList.material_folder}/${mat.folder}/${mat.normal}`, normal => {
                matSource.normal = normal;
                this.checkMaterialLoadCompletion(matSource);
            });
        });
    }

    private checkMaterialLoadCompletion(source: MaterialSource) {
        if (source.albedo && source.normal) {
            this.sourceMaterials.push(source);
        }
        if (this.sourceMaterials.length == this.loadList.materials.length) this.nextStage();
    }

    /**
     *  6. Construct the materials
     */
    private constructMaterials() {
        this.sourceMaterials.forEach(mat => {
            const m = new Material(mat.name, mat.albedo as HTMLImageElement, mat.normal as HTMLImageElement);
            this.loadedMaterials.push(m);
        });
        this.nextStage();
    }

    /**
     *  7. Load 3D models
     */
    private loadModels() {
        console.log('initiated model loading');
        this.loadList.game_objects.forEach(go => {
            console.log('loading model ' + go.name);

            let meshes: I3DObject[] = [];
            let mat = this.loadedMaterials.find(m => m.name == go.material);
            if (!mat) throw `Unknown material '${go.material}' when loading game object '${go.name}'`;

            this.ajaxGet(`${this.loadList.game_object_dir}/${go.mesh}`, (ret: string) => {
                meshes = OBJLoader.loadWavefrontObj(ret);
                this.checkForCompletionAndRegisterGameObject(go.name, meshes, go.shader, mat as Material);
            });
        });
    }

    private checkForCompletionAndRegisterGameObject(name: string, meshes: I3DObject[], shaderName: string, mat: Material) {
        let gos: GameObjectSource = {
            name: name,
            objSource: meshes,
            shader: this.loadedShaders.find(x => x.getName() == shaderName),
            material: mat
        }
        this.sourceGameObjects.push(gos);
        if (this.sourceGameObjects.length == this.loadList.game_objects.length) this.nextStage();
    }

    /**
     *  8. Model initialization and registry
     */
    private initializeModels() {
        this.sourceGameObjects.forEach(go => {
            if (!go.shader) throw "Failed to create game object without a shader";
            go.objSource.forEach(mesh => {
                let g3dobj = Game.instance.objectHolder.construct3dObject(`${go.name}.${mesh.name}`, mesh, go.material, go.shader as ShaderProgram);
                this.loadedGameObjects.push(g3dobj);
                console.log(`Registered object ${g3dobj.name} with id ${g3dobj.id} as color: ${g3dobj.idVec4.asArray()}`);
            });
        });
        this.nextStage();
    }

    /**
     *  9. Load all animations
     */
    private loadAnimations() {
        this.loadList.animations.forEach(a => {
            this.ajaxGet(`${this.loadList.animation_folder}/${a}`, (ret: AnimationSource) => {
                this.sourceAnimations.push(ret);
                if (this.sourceAnimations.length == this.loadList.animations.length) this.nextStage();
            });
        });
    }

    /**
     *  10. Register animations
     */
    private registerAnimations() {
        this.sourceAnimations.forEach(a => {
            let animation = new Animation(
                a.name,
                a.keyframes.map(k => {

                    return <IKeyframe> {
                        delay: k.delay,
                        interpolation: k.interpolation as KeyframeInterpolation,
                        position: (k.position ? new Vec3(k.position.x, k.position.y, k.position.z) : undefined),
                        rotation: (k.rotation ? new Vec3(k.rotation.x, k.rotation.y, k.rotation.z) : undefined),
                        scale: (k.scale ? new Vec3(k.scale.x, k.scale.y, k.scale.z) : undefined)
                    }
                })
            );
            Game.instance.animations.registerAnimation(animation);
        });
        this.nextStage();
    }

    postConstruct() {
        this.loadedShaders.forEach(s => Game.instance.engine.shaders.registerShaderProgram(s));
    }

}

export { Loader }