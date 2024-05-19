const express = require("express");
const { verifyToken } = require("../utils/verifyUsers");
const { developerInfoValidator } = require("../validation/developer");

const route = express.Router();


const { S3Client, DeleteObjectCommand, GetObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3');
const { errorHandler } = require("../utils/error");

const s3 = new S3Client()

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {

            cb(null, { fieldName: file.fieldname, contentDisposition: "attachment", contentType: file.mimetype });
        },
        key: function (req, file, cb) {

            cb(null, Date.now() + file.originalname)
        }
    })
});


route.post("/upload/:userId", verifyToken, developerInfoValidator, upload.any('file'), async function (req, res, next) {
    const { userId } = req.params
    if (userId !== req?.user?.userId) next(errorHandler(403, "route forbidden"))

    const response = await req.files.map(file => {
        return {
            location: file.location,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            key: file.key
        }
    })


    return res.status(200).json({
        message: "file uploaded successfully.",
        status: "success",
        data: response
    })
});

route.get("/list/:userId", verifyToken, developerInfoValidator, async (req, res) => {
    if (userId !== req?.user?.userId) next(errorHandler(403, "route forbidden"))
    try {
        let r = await s3.send(new ListObjectsCommand({ Bucket: BUCKET_NAME }));
        // let response = r.Contents.map(item => item.Key);

        return res.status(200).json({
            message: "file listed successfully.",
            status: "success",
            data: r
        })


    } catch (error) {
        // console.error(error);
        return next(errorHandler(500, "Internal Server Error"))
    }
});

route.get("/download/:userId/:filename", verifyToken, developerInfoValidator, async (req, res) => {
    if (userId !== req?.user?.userId) next(errorHandler(403, "route forbidden"))
    const filename = req.params.filename;
    try {
        let response = await s3.send(new GetObjectCommand({ Bucket: BUCKET_NAME, Key: filename }))

        return res.status(200).json({
            message: "file downloaded successfully.",
            status: "success",
            data: response.Body
        })


    } catch (error) {
        // console.error(error);
        return next(errorHandler(404, "File Not Found"))
    }
});

route.delete("/delete/:userId/:filename", verifyToken, developerInfoValidator, async (req, res) => {
    const filename = req.params.filename;
    try {

        await s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: filename }));

        return res.status(200).json({
            message: "File Deleted Successfully.",
            status: "success"
        })


    } catch (error) {
        // console.error(error);
        return next(errorHandler(500, "Internal Server Error"))
    }
});



module.exports = route;
