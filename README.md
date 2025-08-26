# SVNFolkCake (Southern Vietnam Folk Cake) 

Đây là repository cho niên luận cơ sở với đề tài "Xây dựng Website giới thiệu bánh dân gian Nam Bộ tích hợp nhận dạng bằng hình ảnh với YOLOv8"

## Giới thiệu
Trong bối cảnh hiện nay, có nhiều loại bánh dân gian Nam Bộ đang dần bị quên lãng do tác động của quá trình đô thị hóa nhanh, dẫn đến tình trạng khách du lịch và cả người dân địa phương không còn nhớ tên hay hình dạng nhiều loại bánh. Trước thực trạng đó, đề tài này được đề xuất nhằm mục đích xây dựng hệ thống website giới thiệu các loại bánh dân gian Nam Bộ giúp người dùng có thể tìm kiếm, xem thông tin cũng như upload ảnh và nhận dạng bánh

---
## Website có thể truy cập ở địa chỉ: https://banhxua.vercel.app
## Tính năng
- Xem, tìm kiếm bánh
- Nhận dạng bánh bằng hình ảnh
- Thêm bánh yêu thích hoặc bình luận về bánh đối với người dùng có tài khoản

---

## Cấu trúc thư mục

├── app/            # Frontend

├── backend         # Backend Nodejs

├── yolo-service/   # Backend Yolo service

└── README.md

## 

## Hướng dẫn sử dụng tại local

git clone https://github.com/nhtdanh/SVNFolkCake.git

cd SVNFolkCake
## Cấu hình frontend
cd app

npm install 

Tạo file .env với nội dung:

VITE_API_BASE_URL=http://localhost:3000

cd ..

## Cấu hình backend NodeJS
Trong MongoDB Compass tạo database với tên SVNFolkCake

Tạo 2 collection là categories và cakes sau đó import 2 file JSON tương ướng trong backend

cd backend

npm install 

Tạo file .env với nội dung:

PORT=3000

MONGODB_URI=mongodb://127.0.0.1:27017/SVNFolkCake

DETECT_URL=http://localhost:8000/detect

MODEL_URL=http://localhost:8000/models

FRONTEND_URL=http://localhost:3001

cd ..

## Cấu hình yolo-service
cd yolo-service

Khuyến khích tạo môi trường ảo:

python -m venv .venv

.venv\Scripts\activate

pip install -r requirements.txt

Tạo file .env với nội dung:

HOST=0.0.0.0

PORT=8000

cd ..


---

## Cách sử dụng
Tại SVNFolkCake/yolo-service: python app/main.py

Tại SVNFolkCake/backend: npm start

Tại SVNFolkCake/app: npm run dev


## Chủ sở hữu
Nguyễn Hoàng Tiến Danh B2205858
