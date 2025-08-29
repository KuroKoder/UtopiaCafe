import {
  HiOutlineShoppingCart,
  HiOutlineClipboardCheck,
  HiOutlineCurrencyDollar,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import React from "react";
import OrderFlowCard from "./minicomponent/OrderFlowCard";

const FlowOrder = () => {
  return (
    <div
      className="orderdrinks min-h-screen flex items-center justify-center bg-primary-color"
      style={{
        backgroundImage: `url("./src/assets/img/kopi.jpg")`,
        backgroundSize: "cover",
        backgroundBlendMode: "overlay",
        opacity: 1,
      }}
    >
      <div className="mt-20">
        <div className="container mx-auto py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl text-white font-pacifico font-semibold mb-8 text-center animate-bounce">
              Order Flow
            </h1>

            <div className="grid grid-cols-1 mx-5 gap-6 md:grid-cols-2">
              {/* Step 1: Choose Products */}
              <OrderFlowCard
                step="1"
                title="Memilih Menu di Halaman Order"
                description="Pilih minuman yang ingin kamu buat baik itu teh maupun kopi dan tentukan masing masing jumlahnya."
                icon={
                  <HiOutlineShoppingCart className="text-4xl text-blue-500" />
                }
                customStyles="hover:bg-blue-900 hover:text-white transition duration-300"
              />

              {/* Step 2: Review Order */}
              <OrderFlowCard
                step="2"
                title="Cek Pesanan"
                description="Cek minuman dan jumlah minuman yang kamu ingin pesan jika sudah sesuai selanjutnya klik tombol belanja sekarang."
                icon={
                  <HiOutlineClipboardCheck className="text-4xl text-green-500" />
                }
                customStyles="hover:bg-green-900 hover:text-white transition duration-300"
              />

              {/* Step 3: Payment */}
              <OrderFlowCard
                step="3"
                title="Pembayaran"
                description="Ketika kamu sudah melakukan pengecekan pesanan masukkan nama pemesan pada kolom nama lalu klik bayar, perlu diingat mengisi nama ini wajib untuk dilakukan, setelah klik bayar maka akan muncul popup QRIS selama 5 menit silahkan scan dan bayar sesuai jumlah total harga."
                icon={
                  <HiOutlineCurrencyDollar className="text-4xl text-yellow-500" />
                }
                customStyles="hover:bg-yellow-900 hover:text-white transition duration-300"
              />

              {/* Step 4: Order Status */}
              <OrderFlowCard
                step="4"
                title="Status Pesanan"
                description="Ada beberapa kondisi berdasarkan dari berhasil nya pembayaran yaitu PAID jika pembayaran berhasil dilakukan, PENDING PAYMENT artinya pembayaran belum dilakukan dan telah menekan tombol close pada pop up pembayaran, dan CANCEL artinya pembayaran tidak berhasil dilakukan selama 5 menit."
                icon={
                  <HiOutlineInformationCircle className="text-4xl text-purple-500" />
                }
                customStyles="hover:bg-purple-900 hover:text-white transition duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowOrder;
