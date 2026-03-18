/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Phone,
  CheckCircle2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Zap,
  Users,
  PlayCircle,
  Package,
  Activity,
  Heart,
  Dumbbell,
  Info,
  CircleCheckBig,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LOGO_URL from "logo";
import { formatPhone433, formatPhone442 } from "./utils/formatPhone.js";
// --- Constants & Assets ---
const PRIMARY_COLOR = "emerald"; // Green theme
const PRODUCT_HERO = "input_file_4.png";
const TECH_LABELS = "input_file_0.png";
const BOX_CONTENT = "input_file_1.png";
const USAGE_IMAGE = "input_file_2.png";
const DIAGRAM_IMAGE = "input_file_3.png";

// http://localhost:8082/
const ASSET_URL = "/"; 
// --- Simulated Data ---
const VIETNAMESE_NAMES = [
  "Nguyễn Văn An",
  "Trần Thị Bình",
  "Lê Hoàng Nam",
  "Phạm Minh Tuấn",
  "Vũ Thu Trang",
  "Đặng Quốc Hùng",
  "Bùi Tuyết Mai",
  "Ngô Gia Bảo",
  "Lý Mỹ Linh",
  "Đỗ Anh Đức",
  "Hồ Phương Thảo",
  "Trương Vĩnh Khang",
];

const LOCATIONS = [
  "Hà Nội",
  "TP.HCM",
  "Đà Nẵng",
  "Cần Thơ",
  "Hải Phòng",
  "Bình Dương",
  "Đồng Nai",
];

// --- Components ---

const OrderNotification = () => {
  const [order, setOrder] = useState<{
    name: string;
    location: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    const showOrder = () => {
      const name =
        VIETNAMESE_NAMES[Math.floor(Math.random() * VIETNAMESE_NAMES.length)];
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      setOrder({ name, location, time: "vừa xong" });

      setTimeout(() => setOrder(null), 4000);
    };

    const interval = setInterval(showOrder, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-24 left-1/2 z-50 bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-3 flex items-center gap-3 border border-emerald-100 min-w-[280px]"
        >
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            <Package size={20} />
          </div>
          <div className="text-sm">
            <p className="font-bold text-gray-900">
              {order.name}{" "}
              <span className="font-normal text-gray-500">
                tại {order.location}
              </span>
            </p>
            <p className="text-xs text-emerald-600 font-medium">
              Đã đặt mua Máy LPA12 {order.time}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Header = ({ data }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-50 shadow-sm">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <img
          src={LOGO_URL}
          alt="Toppilife"
          className="h-8 object-contain"
          referrerPolicy="no-referrer"
        />
        <a
          href={"tel:" + data?.customize?.phone}
          className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-bold text-sm"
        >
          <Phone size={14} />
          <span>{formatPhone433(data?.customize?.phone)}</span>
        </a>
      </div>
    </header>
  );
};
type CountdownProps = {
  endTime: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const CountdownTimer2: React.FC<CountdownProps> = ({ endTime }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const diff = new Date(endTime).getTime() - new Date().getTime();

    return {
      days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
      seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const Box = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 bg-white text-emerald-600 rounded-xl shadow-md flex items-center justify-center text-2xl font-bold">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] mt-1 uppercase text-emerald-100">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex justify-center gap-3 mt-3">
      <Box value={timeLeft.days} label="Ngày" />
      <Box value={timeLeft.hours} label="Giờ" />
      <Box value={timeLeft.minutes} label="Phút" />
      <Box value={timeLeft.seconds} label="Giây" />
    </div>
  );
};
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex gap-2 justify-center mt-3">
      {[
        { label: "Giờ", value: format(timeLeft.hours) },
        { label: "Phút", value: format(timeLeft.minutes) },
        { label: "Giây", value: format(timeLeft.seconds) },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-10 h-10 bg-white text-emerald-600 rounded-lg flex items-center justify-center text-lg font-bold shadow-sm border border-emerald-100">
            {item.value}
          </div>
          <span className="text-[8px] uppercase tracking-widest mt-1 font-bold text-white/80">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PurchaseFrame = ({ id, data }: { id?: string; data: any }) => {
  console.log(data?.purchase_frame?.title);
  return (
    <div
      id={id}
      className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-emerald-100 mt-8"
    >
      <div className="p-6 bg-emerald-600 text-white text-center">
        <h3 className="text-xl font-black uppercase tracking-tight">
          {data?.purchase_frame?.title}
        </h3>
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
            ƯU ĐÃI KẾT THÚC SAU
          </p>
          {/* <CountdownTimer2 endTime="2026-03-22T10:00:00Z" /> */}
          <CountdownTimer2 endTime="2026-03-22T10:00:00Z" />
        </div>
      </div>
      {/*  */}
      <div className="p-6">
        <div className="mb-6 text-center">
          <div className="flex flex-col items-center gap-1 mb-4">
            <span className="text-gray-400 line-through text-sm font-bold">
              {data?.purchase_frame?.sale?.presale}
            </span>
            <div className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              {data?.purchase_frame?.sale?.save_money}
            </div>
            <div className="text-3xl font-black text-emerald-600 mt-1">
              {data?.purchase_frame?.sale?.price}
            </div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {data?.purchase_frame?.sale?.note}
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <img
              src={ASSET_URL + data?.purchase_frame?.img_url}
              alt="LPA12 Product"
              className="w-full h-48 object-contain p-4"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <input
              type="text"
              placeholder="Họ và tên của bạn"
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-emerald-500 outline-none transition-all text-sm font-medium placeholder:text-gray-400 placeholder:font-bold"
            />
          </div>
          <div className="relative">
            <input
              type="tel"
              placeholder="Số điện thoại liên hệ"
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-emerald-500 outline-none transition-all text-sm font-medium placeholder:text-gray-400 placeholder:font-bold"
            />
          </div>
          <div className="relative">
            <textarea
              placeholder="Địa chỉ nhận hàng chi tiết"
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-emerald-500 outline-none transition-all h-24 text-sm font-medium placeholder:text-gray-400 placeholder:font-bold resize-none"
            ></textarea>
          </div>

          <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-[0.98] transition-all mt-2 uppercase tracking-wide">
            ĐẶT HÀNG NGAY
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
          {data?.purchase_frame?.policy?.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-emerald-700 font-bold text-[11px]"
            >
              <Truck size={14} />
              <span>{p}</span>
            </div>
          ))}
          {/* <div className="flex items-center gap-2 text-emerald-700 font-bold text-[11px]">
            <Truck size={14} />
            <span>Miễn phí vận chuyển toàn quốc</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-[11px]">
            <ShieldCheck size={14} />
            <span>Bảo hành 12 tháng</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-[11px]">
            <RotateCcw size={14} />
            <span>Lỗi 1 đổi 1 trong 7 ngày</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC<any> = ({ data }) => {
  return (
    <section className="pt-20 pb-10 px-4 bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-4"
        >
          <Zap size={14} />
          <span>{data?.hero?.badge ?? ""}</span>
        </motion.div>

        <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">
          {data?.hero?.title ?? ""}{" "}
          <span className="text-emerald-600">LPA12</span>
        </h1>
        <p className="text-gray-600 text-sm mb-6">{data?.hero?.desc ?? ""}</p>

        <div className="relative mb-8">
          <img
            src={"https://picsum.photos/seed/tech1/600/400"}
            alt="LPA12 Usage"
            className="w-full rounded-3xl shadow-xl border-4 border-white"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-emerald-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Đang hoạt động
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {// [
          //   'Giảm đau cơ', 'Thư giãn cơ bắp',
          //   'Kích thích phục hồi', 'Hỗ trợ săn chắc'
          // ]
          data?.hero?.benefits?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white p-3 rounded-xl border border-emerald-50 shadow-sm"
            >
              <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
              <span className="text-xs font-bold text-gray-700">{item}</span>
            </div>
          ))}
        </div>

        <PurchaseFrame id="hero-order" data={data} />
      </div>
    </section>
  );
};

const TargetAudience = ({data}) => {
  const targets = [
    {
      title: "Người ngồi làm việc lâu",
      desc: "Cổ vai gáy đau nhức",
      img: "https://picsum.photos/seed/office/400/300",
    },
    {
      title: "Người tập thể thao",
      desc: "Cơ căng cứng, mệt mỏi",
      img: "https://picsum.photos/seed/sport/400/300",
    },
    {
      title: "Người đau cơ mãn tính",
      desc: "Không có thời gian đi trị liệu",
      img: "https://picsum.photos/seed/chronic/400/300",
    },
  ];

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-10 text-center uppercase tracking-wider">
          {data?.target_audience?.title}
        </h2>
        <div className="space-y-12">
          {data?.target_audience?.cards.map((t, i) => (
            <div
              key={i}
              className={`flex items-center gap-6 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            >
              <div className="w-1/2">
                <img
                  src={ASSET_URL+t.img_url}
                  alt={t.title}
                  className="w-full rounded-2xl shadow-md border-2 border-white"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-1/2">
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                  {t.title}
                </h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VideoReviews = ({data}) => {
  console.log(data)
  const videos = data?.review?.videos;
  // [
  //   { title: "Video đập hộp", label: "Unboxing" },
  //   { title: "NVVP sử dụng", label: "Cổ vai gáy" },
  //   { title: "Người lớn tuổi", label: "Đầu gối" },
  //   { title: "Nam tài xế", label: "Tay, vai" },
  // ];

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          {data?.review?.title}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {videos.map((v, i) => (
            <div
              key={i}
              className="relative aspect-[9/16] bg-gray-200 rounded-2xl overflow-hidden group"
            >
              <img
                src={ASSET_URL+v.video_url}
                alt={v.title}
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20">
                <PlayCircle
                  size={48}
                  className="mb-2 opacity-80 group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-bold text-center px-2">
                  {v.lable}
                </span>
              </div>
              <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {v.badge}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechDeepDive = ({data}) => {
  // const techs = [
  //   {
  //     title: "15 CHƯƠNG TRÌNH TENS",
  //     subtitle: "Giảm đau",
  //     desc: "Giảm đau lưng, cổ vai gáy, thần kinh, cơ. Xung điện kích thích dây thần kinh giúp giảm tín hiệu đau truyền lên não.",
  //     color: "bg-blue-500",
  //     icon: <Activity size={20} />,
  //   },
  //   {
  //     title: "31 CHƯƠNG TRÌNH EMS",
  //     subtitle: "Phục hồi cơ",
  //     desc: "Kích thích cơ hoạt động, phục hồi sau vận động, cải thiện sức mạnh. Dùng nhiều trong vật lý trị liệu.",
  //     color: "bg-emerald-500",
  //     icon: <Dumbbell size={20} />,
  //   },
  //   {
  //     title: "20 CHƯƠNG TRÌNH MASSAGE",
  //     subtitle: "Thư giãn cơ bắp",
  //     desc: "Thư giãn cơ, giảm căng cơ, tăng tuần hoàn máu. Cảm giác như được massage chuyên nghiệp.",
  //     color: "bg-purple-500",
  //     icon: <Heart size={20} />,
  //   },
  //   {
  //     title: "13 CHƯƠNG TRÌNH FITNESS",
  //     subtitle: "Kích hoạt & săn chắc",
  //     desc: "Kích hoạt nhóm cơ, tăng độ săn chắc, hỗ trợ tập luyện hiệu quả.",
  //     color: "bg-orange-500",
  //     icon: <Zap size={20} />,
  //   },
  // ];
  const techs = data?.teachnology?.cards;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-gray-900 leading-tight">
            {data?.teachnology?.title}
          </h2>
          <p className="text-emerald-600 font-bold text-sm mt-2">
            {data?.teachnology?.desc}
          </p>
        </div>

        <div className="space-y-8">
          {techs.map((t, i) => (
            <div key={i} className="relative">
              <div
                className={`w-full aspect-video rounded-3xl overflow-hidden mb-4 shadow-lg`}
              >
                <img
                  src={ASSET_URL+t.img_url}
                  alt={t.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                  <div className={`w-2 h-2 rounded-full bg-emerald-500`}></div>
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {t.badge}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const KeyFeatures = ({data}) => {
  // const features = [
  //   {
  //     title: "2 kênh độc lập",
  //     desc: "Sử dụng cho 2 người hoặc 2 vùng cơ thể cùng lúc",
  //     img: "https://picsum.photos/seed/feature1/400/300",
  //   },
  //   {
  //     title: "50 mức cường độ",
  //     desc: "Điều chỉnh linh hoạt cho trải nghiệm tốt nhất",
  //     img: "https://picsum.photos/seed/feature2/400/300",
  //   },
  //   {
  //     title: "Thời gian tùy chỉnh",
  //     desc: "5–60 phút, phù hợp mọi tình huống",
  //     img: "https://picsum.photos/seed/feature3/400/300",
  //   },
  //   {
  //     title: "Cảnh báo rơi miếng dán",
  //     desc: "Chức năng thông minh ngăn ngừa bị bỏng",
  //     img: "https://picsum.photos/seed/feature4/400/300",
  //   },
  //   {
  //     title: "Sạc Type-C",
  //     desc: "Pin Lithium sạc lại, sử dụng lâu dài",
  //     img: "https://picsum.photos/seed/feature5/400/300",
  //   },
  //   {
  //     title: "Tự động khóa",
  //     desc: "An toàn khi không thao tác",
  //     img: "https://picsum.photos/seed/feature6/400/300",
  //   },
  //   {
  //     title: "Thiết kế nhỏ gọn",
  //     desc: "Chỉ nặng 145g, dễ dàng mang theo",
  //     img: "https://picsum.photos/seed/feature7/400/300",
  //   },
  // ];
  const features = data?.is_featured?.cards;

  return (
    <section className="py-12 px-4 bg-emerald-900 text-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-12 text-center uppercase tracking-wider">
          {data?.is_featured?.title}
        </h2>
        <div className="space-y-12">
          {features.map((f, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            >
              <div className="w-1/2">
                <img
                  src={ASSET_URL+f.img_url}
                  alt={f.title}
                  className="w-full rounded-2xl shadow-lg border border-white/10"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-1/2">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2
                    className="text-emerald-400 shrink-0"
                    size={16}
                  />
                  <h4 className="font-bold text-sm leading-tight">{f.title}</h4>
                </div>
                <p className="text-[10px] text-emerald-100/70 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BoxContent = ({data}) => {
  // const items = [
  //   "Hướng dẫn nhanh x1",
  //   "Sách hướng dẫn sử dụng x1",
  //   "Dây điện cực x2",
  //   "Miếng dán điện cực x4",
  //   "Cáp sạc Type-C x1",
  //   "Túi bảo quản x1",
  // ];
  const items = data?.box_content?.list;
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-8 text-center uppercase tracking-wider">
          {data?.box_content?.title}
        </h2>
        <div className="flex items-center gap-6">
          <div className="w-1/2">
            <img
              src={ASSET_URL+data?.box_content?.img_url}
              alt="Box Content"
              className="w-full rounded-2xl shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="w-1/2 space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></div>
                <span className="text-[11px] font-bold text-gray-700 leading-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const UsageSteps = ({data}) => {
  // const steps = [
  //   {
  //     step: "Bước 1",
  //     title: "Dán miếng điện cực",
  //     desc: "Dán vào vùng cần trị liệu",
  //     img: "https://picsum.photos/seed/step1/400/300",
  //   },
  //   {
  //     step: "Bước 2",
  //     title: "Kết nối dây",
  //     desc: "Kết nối dây điện cực với thiết bị",
  //     img: "https://picsum.photos/seed/step2/400/300",
  //   },
  //   {
  //     step: "Bước 3",
  //     title: "Chọn chế độ",
  //     desc: "Chọn 1 trong 79 chương trình",
  //     img: "https://picsum.photos/seed/step3/400/300",
  //   },
  //   {
  //     step: "Bước 4",
  //     title: "Điều chỉnh cường độ",
  //     desc: "Tăng giảm mức phù hợp",
  //     img: "https://picsum.photos/seed/step4/400/300",
  //   },
  // ];

  const steps = data?.cards;
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-12 text-center uppercase tracking-wider">
          {data?.title}
        </h2>
        <div className="space-y-12">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-6 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            >
              <div className="w-1/2">
                <img
                  src={ASSET_URL+s.img_url}
                  alt={s.title}
                  className="w-full rounded-2xl shadow-md border-2 border-white"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-1/2">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs mb-3">
                   {i + 1}
                </div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                  Bước{s.step}
                </p>
                <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                  {s.title}
                </h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-gray-600 italic font-medium px-4">
          "Sau đó bạn chỉ cần thư giãn và để thiết bị hoạt động."
        </p>
      </div>
    </section>
  );
};

const BodyAreas = ({data}) => {
  // const areas = [
  //   { name: "Cổ vai gáy", img: "https://picsum.photos/seed/neck/300/300" },
  //   { name: "Lưng", img: "https://picsum.photos/seed/back/300/300" },
  //   { name: "Bụng", img: "https://picsum.photos/seed/abs/300/300" },
  //   { name: "Tay", img: "https://picsum.photos/seed/arm/300/300" },
  //   { name: "Đùi", img: "https://picsum.photos/seed/thigh/300/300" },
  //   { name: "Chân", img: "https://picsum.photos/seed/leg/300/300" },
  // ];

  const areas =data?.cards;
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-8 text-center uppercase tracking-wider">
          {data?.title}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {areas.map((area, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-2xl overflow-hidden group"
            >
              <img
                src={ASSET_URL+area.img_url}
                alt={area.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center p-4">
                <span className="text-white font-black text-sm uppercase tracking-widest text-center">
                  {area.title}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="mt-8">
          <img
            src={TECH_LABELS}
            alt="Body Areas"
            className="w-full rounded-3xl shadow-lg"
            referrerPolicy="no-referrer"
          />
        </div> */}
      </div>
    </section>
  );
};

const BeforeAfter = ({data}) => {
  return (
    <section className="py-12 px-4 bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-8 text-center">SO SÁNH HIỆU QUẢ</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-xs font-bold text-red-400 uppercase mb-3">
              Trước khi dùng
            </p>
            <ul className="space-y-2 text-[11px] text-gray-400">
              {data?.before?.map((b, i)=>{
                return (
                  <li>• {b}</li>
                )
              })}
            </ul>
          </div>
          <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/30">
            <p className="text-xs font-bold text-emerald-400 uppercase mb-3">
              Sau khi dùng
            </p>
            <ul className="space-y-2 text-[11px] text-emerald-100">
              {data?.after?.map((a, i)=>{
                return (
                  <li>• {a}</li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const Policies = ({data}) => {

  return (
    <section className="py-8 px-4 bg-white border-y border-gray-100">
      <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
        {data?.warrantys?.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl"
          >
            <div className="text-emerald-600">{<CircleCheckBig  size={20}/>}</div>
            <span className="text-[10px] font-bold text-gray-700 uppercase">
              {item}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = ({data}) => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 pb-32">
      <div className="max-w-md mx-auto">
        <img
          src={LOGO_URL}
          alt="Toppilife"
          className="h-8 mb-6 brightness-0 invert"
          referrerPolicy="no-referrer"
        />
        <h4 className="font-bold text-lg mb-4">{data?.worktime}</h4>
        <ul className="space-y-3 text-sm text-gray-400">
          <li className="flex gap-2">
            <span className="text-white font-bold whitespace-nowrap">Địa chỉ:</span>
            {data?.address}
          </li>
          <li className="flex gap-2">
            <a href="tel:+">
              <span className="text-white font-bold">Hotline: </span>
            {formatPhone433(data?.phone)}
            </a>
          </li>
        </ul>
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
          <p>© 2024 Toppilife. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [pageData, setPageData] = useState(null);
  const apiLocal = "http://localhost:8082/api/landing";
  const apiDeploy = "/api/landing";

  useEffect(() => {
    fetch(apiDeploy)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setPageData(data.data);
      });
  }, []);
  if (!pageData) {
    return (
      <>
        <div className="w-[50%] bg-gray-50 rounded-lg px-3 py-4"></div>
      </>
    );
  }
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-600">
      <Header data={pageData} />
      <main className="max-w-md mx-auto shadow-2xl bg-white min-h-screen">
        <Hero data={pageData} />
        <Policies data={pageData}/>
        <TargetAudience data={pageData}  />
        <VideoReviews data={pageData} />

        {/* Customer Feedback Placeholder */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {pageData?.feedback?.title}
            </h2>
            <div className="flex justify-center items-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={20}
                  fill="#fbbf24"
                  className="text-yellow-400"
                />
              ))}
              <span className="ml-2 font-bold text-gray-900">
                4.9/5 (4 đánh giá)
              </span>
            </div>
            <div className="space-y-4">
              {
              // [1, 2, 3, 4]
              pageData?.feedback?.list
              .map((f,i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">
                      {f.title}
                    </span>
                    <div className="flex text-yellow-400">
                      {
                      Array?.from({length: f.star})?.map((_, z)=>(
                        <Star key={z} size={10} fill="currentColor" />
                      ))
                      // [1, 2, 3, 4, 5].map((j) => (
                      //   <Star key={j} size={10} fill="currentColor" />
                      // ))
                      }
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TechDeepDive data={pageData} />
        <KeyFeatures data={pageData} />
        <BoxContent data={pageData}/>
        <UsageSteps data={pageData?.usage_instruction} />
        <BodyAreas data={pageData?.body_area} />
        <BeforeAfter data={pageData?.comparison} />

        {/* Final CTA */}
        <section className="py-16 px-4 bg-emerald-50 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">
            Sẵn sàng chăm sóc sức khỏe?
          </h2>
          <p className="text-gray-600 text-sm mb-8">
            Đừng để những cơn đau mỏi làm phiền cuộc sống của bạn.
          </p>
          <PurchaseFrame id="final-order" data={pageData} />
        </section>
      </main>

      <Footer data={pageData?.customize} />
      <OrderNotification />

      {/* Floating Mobile CTA */}
      <div className="fixed bottom-6 left-6 right-6 z-40 max-w-md mx-auto">
        <button
          onClick={() =>
            document
              .getElementById("final-order")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2 animate-pulse"
        >
          <Zap size={20} />
          MUA NGAY - GIẢM 30%
        </button>
      </div>
    </div>
  );
}
