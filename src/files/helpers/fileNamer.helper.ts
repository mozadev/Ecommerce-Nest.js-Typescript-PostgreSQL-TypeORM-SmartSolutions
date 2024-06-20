export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  //   console.log({ file });
  // this validation is innecesary, because the file is required. Let's leave it just in case
  if (!file) return callback(new Error('No file'), false);

  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `Hola mesa.${fileExtension}`;

  callback(null, fileName);
};