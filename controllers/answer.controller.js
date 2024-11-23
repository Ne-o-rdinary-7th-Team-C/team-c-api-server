const { Storage } = require("@google-cloud/storage");
const path = require("path");
const config = require("../config.json");

const storage = new Storage({
  keyFilename: config.GOOGLE_APPLICATION_CREDENTIALS, // 다운로드한 서비스 계정 키 파일 경로
});
const bucket = storage.bucket("store-img"); // 생성한 GCS 버킷 이름

// 이미지 업로드 처리 함수
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("파일이 업로드되지 않았습니다");
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
      res.status(200).json({ message: "파일 업로드 성공", fileUrl: fileUrl });
    });

    blobStream.on("error", (err) => {
      console.error(err);
      res.status(500).send("업로드 실패");
    });

    // 파일을 GCS로 전송
    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("업로드 파일 에러");
  }
};

module.exports = {
  uploadImage,
};
