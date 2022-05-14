import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';

interface Ifile {
  files: FileUpload[];
}

@Injectable()
export class FileService {
  //
  async upload({ files }: Ifile) {
    const storage = new Storage({
      keyFilename: 'langbee-fileKey.json',
      projectId: 'teamproject-349902',
    }).bucket('langbeefile');

    //일단 먼저 다 받기
    const waitedFiles = await Promise.all(files);
    console.log(waitedFiles);

    const directory = await Promise.all(
      waitedFiles.map((el) => {
        return new Promise((resolve, reject) => {
          el.createReadStream()
            .pipe(storage.file(el.filename).createWriteStream()) //pipe 업로드를 하고 난 후 2차적인 작업을 하고 싶을때
            .on('finish', () => resolve(`teamproject-349902/${el.filename}`))
            .on('error', () => reject());
        });
      }),
    ); //[file,file,file,file...]

    const URL = 'https://storage.googleapis.com/langbeefile/';
    const fixedURL = directory.map((e: string) =>
      e.replace('teamproject-349902/', URL),
    );
    const final_directory = directory.map((e: string) =>
      e.replace('teamproject-349902/', ''),
    );
    const results = final_directory.concat(fixedURL);

    return results;
  }

  async delete({ files }) {
    const storage = new Storage({
      keyFilename: 'langbee-fileKey.json',
      projectId: 'teamproject-349902',
    }).bucket('langbeefile');

    files.map((el) => {
      return new Promise(() => {
        storage.file(el).delete();
      }).catch(console.log);
    });

    return 'deleted';
  }
}
// return new Promise((resolve, reject) => {
//   storage.file(el).delete();
// }
