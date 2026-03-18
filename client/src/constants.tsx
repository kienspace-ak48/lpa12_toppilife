import { 
  Zap, 
  ShieldCheck, 
  Smile, 
  Clock, 
  Smartphone, 
  Battery, 
  BarChart3, 
  Monitor,
} from 'lucide-react';

export const LOGO_URL = '/image/logo_5.png';
export const PRODUCT_IMG_1 = 'vfdbfdcom/tientv-dev/landing-page-ces/main/product1.png';
export const PRODUCT_IMG_2 = 'vfdbfdcom/tientv-dev/landing-page-ces/main/product2.png';
export const PRODUCT_IMG_3 = 'vfdbfdcom/tientv-dev/landing-page-ces/main/product3.png';
// https://raw.githubusercontent.
export const LIFESTYLE_IMAGES = {
  SLEEP: 'https://images.unsplash.com/photo-1541781719179-45f04ba4ee96?auto=format&fit=crop&q=80&w=1000',
  RELAX: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000',
  STRESS: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=1000',
  WORKING: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000',
  NATURE: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000'
};

export const COLORS = {
  primary: '#16a34a', // ToppiLife Green
  secondary: '#0891b2', // Teal/Cyan
  accent: '#f0fdf4',
  text: '#1f2937',
};

export const NAVIGATION = [
  { name: "nav.intro", href: "#intro" },
  { name: "nav.product", href: "#product" },
  { name: "nav.benefits", href: "#benefits" },
  { name: "nav.faq", href: "#faq" },
];

export const PAIN_POINTS = [
  "Ban ngày đầu óc căng như dây đàn, tối nằm xuống vẫn suy nghĩ không dứt",
  "Ngủ đủ giờ nhưng sáng dậy vẫn nặng đầu, thiếu tỉnh táo",
  "Dễ tỉnh giấc giữa đêm, khó ngủ lại",
  "Càng cố ngủ, cơ thể càng căng thẳng hơn",
  "Áp lực công việc kéo dài khiến tinh thần lúc nào cũng mệt mỏi"
];

export const CORE_VALUES = [
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Hiệu quả chứng minh",
    desc: "Dựa trên các nghiên cứu lâm sàng hơn 30 năm tại Mỹ"
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "An toàn tuyệt đối",
    desc: "Phương pháp không xâm lấn, không gây đau đớn, không lo phụ thuộc thuốc"
  },
  {
    icon: <Smile className="w-8 h-8" />,
    title: "Cân bằng cảm xúc",
    desc: "Hỗ trợ thư giãn hệ thần kinh, cải thiện trạng thái lo âu"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Tiện lợi tối đa",
    desc: "Chỉ 15 phút mỗi ngày, sử dụng linh hoạt mọi lúc mọi nơi"
  }
];

export const FEATURES = [
  {
    icon: <Smartphone />,
    title: "Thiết kế nhỏ gọn",
    desc: "Dễ dàng mang theo khi đi du lịch hoặc công tác",
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'
  },
  {
    icon: <Zap />,
    title: "35 mức độ điều chỉnh",
    desc: "Cá nhân hóa cường độ phù hợp với độ nhạy cảm của mỗi người",
    img: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=600'
  },
  {
    icon: <Monitor />,
    title: "Màn hình LED thông minh",
    desc: "Hiển thị rõ ràng thời gian và dung lượng pin",
    img: PRODUCT_IMG_2
  },
  {
    icon: <Battery />,
    title: "Pin bền bỉ",
    desc: "Sạc một lần có thể sử dụng lên đến 10 ngày",
    img: 'https://images.unsplash.com/photo-1610940882244-5966236ca64d?auto=format&fit=crop&q=80&w=600'
  }
];

export const STEPS = [
  {
    title: "Chuẩn bị",
    desc: "Sạc pin đầy đủ, làm ẩm nhẹ vùng da tiếp xúc. Ngồi hoặc nằm thư giãn.",
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: "Gắn kẹp tai",
    desc: "Đeo kẹp tai vào hai tai đúng vị trí, đảm bảo tiếp xúc nhẹ và thoải mái.",
    img: PRODUCT_IMG_1
  },
  {
    title: "Bật máy & Chỉnh mức",
    desc: "Bắt đầu từ mức thấp, tăng dần đến khi có cảm giác châm chích nhẹ.",
    img: PRODUCT_IMG_3
  },
  {
    title: "Thư giãn 15 phút",
    desc: "Thiết bị tự động kết thúc sau 15 phút. Tháo kẹp tai và cất máy.",
    img: LIFESTYLE_IMAGES.SLEEP
  }
];

export const FAQS = [
  {
    q: "Dùng máy có bị giật điện không?",
    a: "Thiết bị sử dụng dòng điện DC điện áp cực thấp (3.7V), chỉ tạo cảm giác châm chích nhẹ hoặc thậm chí không có cảm giác gì rõ rệt tùy cơ địa, nhưng vẫn đang âm thầm hoạt động hiệu quả."
  },
  {
    q: "Dùng bao lâu thì có kết quả?",
    a: "Tùy vào tình trạng, có thể sau lần đầu tiên bạn đã cảm nhận sự khỏe khoắn tinh thần, không còn đau đầu, hoặc có thể mất vài tuần để thấy chất lượng giấc ngủ cải thiện rõ rệt."
  },
  {
    q: "Ai không nên sử dụng?",
    a: "Người đang dùng máy tạo nhịp tim, thiết bị điện tử cấy ghép trong đầu hoặc phụ nữ đang mang thai."
  },
  {
    q: "Nếu tôi đang dùng thuốc khác thì có dùng CES được không?",
    a: "Trong hầu hết trường hợp là có thể. Tuy nhiên, bạn nên trao đổi với chuyên gia tư vấn của ToppiLife để được hướng dẫn phù hợp nhất."
  },
  {
    q: "CES có thay thế điều trị y tế không?",
    a: "Không. CES là giải pháp hỗ trợ chăm sóc sức khỏe chủ động, không thay thế điều trị y khoa hay chỉ định của bác sĩ."
  }
];
