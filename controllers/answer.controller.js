const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { GCS_CREDENTIALS } = require("../config.json");
const { InvalidInputError } = require("../errors");

const storage = new Storage({
  credentials: GCS_CREDENTIALS,
});
const bucket = storage.bucket("store-img"); // 생성한 GCS 버킷 이름

// 이미지 업로드 처리 함수
const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return next(new InvalidInputError("파일이 첨부되지 않았습니다."));
  }

  try {
    // 업로드할 파일의 메타데이터 설정
    const blob = bucket.file(Date.now() + path.extname(req.file.originalname));
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    blobStream.on("finish", () => {
      const fileUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res
        .status(200)
        .success({ message: "파일 업로드 성공", fileUrl: fileUrl });
    });

    blobStream.on("error", (err) => {
      console.error(err);
      return next(
        new FailToUploadError("GCS측 오류로 파일 업로드에 실패했습니다.")
      );
    });

    // 파일을 GCS로 전송
    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    return next(new InvalidInputError("잘못된 파일 형식입니다."));
  }
};

module.exports = {
  uploadImage,
};
