/**
 * Method to read data when file is dropped into a particular area or pasted. Intended to work with images for which this method is created.
 *  Could only work with images for now.
 * @param items Can be files dropped or pasted into a particular area.
 * @param fileType This specifies method to take actions, i.e., in case of image this creates a image blob.
 * @returns files in string format.
 */
export const readFromClipOrDropData = (
  items: DataTransferItemList | FileList,
  fileType: string
): string[] => {
  let newFiles: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.startsWith(fileType)) {
      let file;
      // getAsFile is only available on DataTransferItem.
      if (item instanceof DataTransferItem) {
        file = item.getAsFile();
      } else if (item instanceof File) {
        file = item;
      }

      const reader = new FileReader();
      // Save read file into file array
      reader.onload = () => {
        newFiles.push(reader.result as string);
      };
      // Read the file as url.
      reader.readAsDataURL(file as Blob);
    }
  }
  return newFiles;
};
