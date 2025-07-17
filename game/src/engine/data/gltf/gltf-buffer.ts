export class GLTFBuffer {
	private readonly _data: ArrayBuffer;

	constructor(data: ArrayBuffer) {
		this._data = data;
	}

	get data() {
		return this._data;
	}

	/**
	 * The buffer construction is delegated to the bufferView class.
	 * Why? Because while it's valid to just load the buffer in memory and reference it as both
	 * ARRAY_BUFFER and ELEMENT_ARRAY_BUFFER (for indices) the documentation strongly advises
	 * against it. As stated on the ARB_vertex_buffer_object externsion spec:
	 *
	 *  Should this extension include support for allowing vertex indices
	 *  to be stored in buffer objects?
	 *
	 *  RESOLVED: YES.  It is easily and cleanly added with just the
	 *  addition of a binding point for the index buffer object.  Since
	 *  our approach of overloading pointers works for any pointer in GL,
	 *  no additional APIs need be defined, unlike in the various *_element_array extensions.
	 *
	 *  Note that it is expected that implementations may have different
	 *  memory type requirements for efficient storage of indices and
	 *  vertices.  For example, some systems may prefer indices in AGP
	 *  memory and vertices in video memory, or vice versa; or, on
	 *  systems where DMA of index data is not supported, index data must
	 *  be stored in (cacheable) system memory for acceptable
	 *  performance.  As a result, applications are strongly urged to
	 *  put their models' vertex and index data in separate buffers, to
	 *  assist drivers in choosing the most efficient locations.
	 *
	 * And as the bufferView class is the one that contains the information of what that
	 * buffer range is supposed to represent, I decided to delegate the buffer construction
	 * to the bufferView.
	 */
}
