const ImageInput = () => {
  return (
    <div className="grid w-full  items-center gap-1 text-neutral-200 ">
      <input
        id="picture"
        type="file"
        placeholder="Upload Images"
        multiple
        accept="image/png, image/jpeg"
        name="uploadedImage"
        className="file:dark:text-neutral-200 h-10 file:border-none font-light file:font-light file:hover:text-neutral-200 bg-opacity-50 dark:bg-opacity-50 text-neutral-800 file:mr-3 dark:text-neutral-200 dark:bg-neutral-800 file:px-2 p-0 file:text-base inline-flex file:h-full text-base dark:border-neutral-700 border-neutral-300 border bg-neutral-200 file:dark:bg-indigo-500 file:bg-indigo-500 file:text-neutral-200 file:transition-all file:duration-200 file:hover:bg-indigo-400 rounded-2xl overflow-hidden file:rounded-r-2xl "
      />
      <p
        className=" text-sm text-neutral-500 dark:text-neutral-300 my-1 ml-1"
        id="file_input_help"
      >
        SVG, PNG, JPG or GIF (MAX. 800x400px).
      </p>
    </div>
  );
};

export default ImageInput;
