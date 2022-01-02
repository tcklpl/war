import { LoadingState } from "../../loader";
import { LocalizationProvider } from "../../localization/localization_provider";

export class UILoading {

    static loadingStateChanged(newState: LoadingState, current: number, total: number) {
        $('#loading-screen-info').html(`${newState}`);
        $('#loading-progress-bar').css('width', `${current / total * 100}%`);
    }

    static ajaxLoadFinished() {
        $('#loading-screen-info').html(LocalizationProvider.locale.strings.loading_ajax_finished);
        $('#loading-progress-bar').addClass('progress-bar-striped').addClass('progress-bar-animated');
    }

    static buffersInitialized() {
        $('#loading-screen-info').html(LocalizationProvider.locale.strings.loading_finished);
        $('#loading-progress-bar').removeClass('progress-bar-striped').removeClass('progress-bar-animated');
        $('#loading-progress-bar').removeClass('bg-secondary').addClass('bg-success');
        $('#loading-screen-div').fadeOut();
    }

    static loadFailed(name: string) {
        $('#loading-screen-info').html(`${LocalizationProvider.locale.strings.loading_failed}`);
        $('#loading-progress-bar').removeClass('bg-secondary').addClass('bg-danger');
    }

}