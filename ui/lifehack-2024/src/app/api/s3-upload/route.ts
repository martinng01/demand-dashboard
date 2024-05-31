import { POST as post1 } from "next-s3-upload/route";

const POST = post1.configure({
    key(req, filename) {
        return `lifehack2024-milk-demand/data/raw/${filename}`;
    }
})

export { POST }