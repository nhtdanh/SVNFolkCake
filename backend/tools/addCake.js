const mongoose = require("mongoose");
const Cake = require("../app/models/Cake"); 
require("dotenv").config();

const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

const cakeData = [
  {
    name: "Bánh Bò",
    englishName: "Vietnamese Honeycomb Cake",
    description:
      "Bánh bò là món bánh quen thuộc với người miền Nam, có độ dẻo mềm cùng hương vị thơm ngon và cực kỳ dễ ăn. Bánh bò vừa ra khỏi xửng hấp có màu trắng nõn nà (màu nguyên bản, có nhiều biến thể như màu tím từ lá cẩm hay màu xanh từ lá dứa) cùng mùi thơm nhẹ của bột gạo cùng mùi men đặc trưng. Vì có nước cốt dừa nên bánh sẽ vừa thơm vừa béo. Cốt bánh khi xé ra bông xốp, dai dai rất vừa ăn.",
    origin: "Miền Nam",
    tags: ["bánh ngọt", "xốp", "miền Nam", "pandan", "bánh hấp", "men"],
    category: "68ab1ae8145f62e0428edf85", // Bánh Hấp
    image: { main: "/public/uploads/cakes/banhbo.jpg" },
  },
  {
    name: "Bánh Cam",
    englishName: "Vietnamese Sesame Balls",
    description:
      "Bánh cam là món quà vặt phổ biến ở miền Tây, thường được bán chung với Bánh Còng, bánh có vị ngọt, được phủ lớp đường màu cam óng ánh. Bánh cam là tên gọi của người miền Nam vì nó có hình dáng tròn như quả cam, người miền ngoài gọi đây là bánh rán. Bột bánh được làm từ bột nếp và bột gạo. Một số nơi cho thêm ít khoai lang vàng vào trong phần bột để tạo độ bùi, thơm. Phần nhân được làm từ đậu xanh đánh và đường, sên thành viên tròn. Sau khi nhồi bột, người ta cán mịn, cắt thành miếng tròn, cho nhân vào giữa rồi gói lại, vo viên và chiên lên.",
    origin: "Tây Nam Bộ",
    tags: ["bánh ngọt", "chiên", "đậu xanh", "bột nếp", "món vặt"],
    category: "68ab1ae8145f62e0428edf86", // Bánh Chiên
    image: { main: "/public/uploads/cakes/banhcam.jpg" },
  },
  {
    name: "Bánh Chuối Hấp",
    englishName: "Vietnamese Steamed Banana Cake",
    description:
      "Bánh Chuối Hấp là món bánh chuối hấp dân dã Việt Nam. Bánh làm từ chuối chín nghiền trộn với bột năng và bột gạo, khi chín có kết cấu dẻo dai, ngọt tự nhiên. Thường phục vụ kèm nước sốt dừa thơm béo, trân châu và lạc rang.",
    origin: "Việt Nam",
    tags: ["bánh chuối", "bánh hấp", "bột năng", "dừa", "món tráng miệng"],
    category: "68ab1ae8145f62e0428edf85", // Bánh Hấp
    image: { main: "/public/uploads/cakes/banhchuoi.jpg" },
  },
  {
    name: "Bánh Cống",
    englishName: "Vietnamese Fried Shrimp Cake",
    description:
      'Bánh cống là một món ăn vặt nổi tiếng của miền Tây Nam Bộ, đặc biệt là tỉnh Sóc Trăng. Món bánh này được làm từ bột gạo, đậu xanh, thịt băm và tôm, chiên ngập dầu trong một chiếc khuôn hình ống gọi là "cống", cho ra bánh có lớp vỏ giòn rụm, vàng sậm với lớp nhân béo bùi bên trong. Bánh thường được ăn kèm với các loại rau sống như xà lách, diếp cá, rau răm và chấm với nước mắm chua ngọt, tạo nên một hương vị thơm ngon khó cưỡng.',
    origin: "Sóc Trăng",
    tags: ["bánh chiên", "tôm", "đậu xanh", "sông Cửu Long", "món vặt"],
    category: "68ab1ae8145f62e0428edf86", // Bánh Chiên
    image: { main: "/public/uploads/cakes/banhcong1.jpg" },
  },
  {
    name: "Bánh Còng",
    englishName: "Vietnamese Fried Donut",
    description:
      "Bánh còng là loại bánh dân giã ở miền Tây Việt Nam, bánh được tạo hình giống bánh donut, dạng vòng tròn như một chiếc vòng. Người miền Tây thường gọi chiếc vòng là cái còng, cũng là xuất xứ tên của món bánh này. Bánh còng thường được bán cùng Bánh Cam là bởi vì nguyên liệu làm bánh na ná, chỉ khác ở chỗ bánh cam có nhân đậu xanh, bánh còng không có nhân. Bột bánh được làm từ bột nếp và bột gạo, người ta nặn bột bánh thành dây dài rồi nối lại thành chiếc vòng. Bánh tạo hình xong sẽ được lăn qua mè trắng rồi thả vào chảo dầu, chiên vàng.",
    origin: "Tây Nam Bộ",
    tags: ["bánh chiên", "bột nếp", "miền Tây", "mè trắng"],
    category: "68ab1ae8145f62e0428edf86", // Bánh Chiên
    image: { main: "/public/uploads/cakes/banhcong2.jpg" },
  },
  {
    name: "Bánh Da Lợn",
    englishName: "Vietnamese Steamed Layer Cake",
    description:
      "Bánh da lợn là một loại bánh truyền thống phổ biến của người Nam Bộ với các lớp bánh nhiều màu sắc xen kẽ, mềm dẻo. Bánh được làm từ bột năng, đậu xanh, nước cốt dừa và lá dứa. Mỗi lớp bánh có một hương vị riêng, lớp đậu xanh ngọt bùi, lớp lá dứa thơm dịu. Bánh da lợn không chỉ hấp dẫn về màu sắc mà còn lôi cuốn bởi hương vị phong phú, dễ ăn. Món bánh này thường được người dân miền Tây dùng trong các dịp lễ hội, tiệc tùng hoặc đơn giản là món ăn vặt hàng ngày.",
    origin: "Tây Nam Bộ",
    tags: ["bánh hấp", "lá dứa", "đậu xanh", "chay", "bột năng"],
    category: "68ab1ae8145f62e0428edf85", // Bánh Hấp
    image: { main: "/public/uploads/cakes/banhdalon.jpg" },
  },
  {
    name: "Bánh Đúc Mặn",
    englishName: "Vietnamese Savory Rice Cake",
    description:
      "Bánh đúc mặn là một món bánh dân dã, quen thuộc ở miền Nam Việt Nam, đặc biệt là ở Cần Thơ. Món bánh này có hương vị đậm đà, hấp dẫn, được làm từ bột gạo, bột năng, và có thêm nước cốt dừa để tăng thêm độ béo. Bánh đúc mặn thường được ăn kèm với các loại nhân như tôm, thịt, nấm mèo, hành phi, và chan thêm nước mắm chua ngọt.",
    origin: "Miền Nam",
    tags: ["bánh mặn", "bột gạo", "món ăn đường phố", "đậu phộng", "hành phi"],
    category: "68ab1ae8145f62e0428edf85", // Bánh Hấp
    image: { main: "/public/uploads/cakes/banhducman.jpg" },
  },
  {
    name: "Bánh Ít Trần",
    englishName: "Vietnamese Sticky Rice Dumpling",
    description:
      "Bánh ít trần là một món bánh dân dã, quen thuộc của người miền Nam. Bánh có hình dạng tròn, nhỏ xinh, được làm từ bột nếp dẻo dai, bên trong là nhân đậu xanh bùi béo hoặc nhân thịt heo, tôm, nấm mèo... tùy theo khẩu vị. Bánh thường được ăn kèm với nước mắm cay đối với nhân mặn hoặc ăn kèm nước cốt dừa béo ngậy với nhân ngọt (đậu xanh), tạo nên hương vị đậm đà, khó quên.",
    origin: "Miền Nam",
    tags: ["bánh hấp", "bột nếp", "đậu xanh", "miền Tây"],
    category: "68ab1ae8145f62e0428edf85", // Bánh Hấp
    image: { main: "/public/uploads/cakes/banhittran.jpg" },
  },
  {
    name: "Bánh Khoai Mì Nướng",
    englishName: "Vietnamese Baked Cassava Cake",
    description:
      "Bánh khoai mì nướng là một món bánh dân dã, quen thuộc của Việt Nam, đặc biệt là ở các tỉnh miền Tây. Món bánh này có vị bùi bùi của khoai mì, béo ngậy của nước cốt dừa và đậu xanh, cùng với mùi thơm đặc trưng của việc nướng trên than hoa (hoặc có thể nướng bằng lò nướng, chảo, nồi chiên không dầu). Bánh thường được bán ở các xe đẩy ven đường, hoặc có thể tự làm tại nhà với các nguyên liệu dễ tìm.",
    origin: "Việt Nam (phổ biến ở Tây Nam Bộ)",
    tags: ["bánh nướng", "khoai mì", "dừa", "đậu xanh", "tráng miệng"],
    category: "68ab1ae8145f62e0428edf87", // Bánh Nướng
    image: { main: "/public/uploads/cakes/banhkhoaiminuong.jpg" },
  },
  {
    name: "Bánh Lá Mơ",
    englishName: "Vietnamese Leaf Steamed Cake",
    description:
      "Bánh lá mơ là loại bánh độc đáo, mang đậm hương vị thiên nhiên. Được làm từ lá mơ, bột gạo và nước cốt dừa, bánh có màu xanh đậm đặc trưng và vị thơm ngát. Khi ăn, bạn sẽ cảm nhận được sự dẻo mịn của bột gạo kết hợp với vị thanh mát, hơi chát nhẹ của lá mơ. Loại bánh này không chỉ ngon mà còn có tác dụng thanh nhiệt, giải độc, rất thích hợp để thưởng thức vào những ngày hè nóng bức. Bánh lá mơ thể hiện sự khéo léo và sáng tạo của người dân Nam Bộ trong việc tận dụng nguyên liệu tự nhiên.",
    origin: "Tây Nam Bộ",
    tags: ["bánh hấp", "lá mơ", "miệt vườn", "dừa"],
    category: "68ab1ae8145f62e0428edf85", // Bánh Hấp
    image: { main: "/public/uploads/cakes/banhlamo.jpg" },
  },
  {
    name: "Bánh Lọt",
    englishName: "Vietnamese Cendol",
    description:
      "Bánh lọt là món ăn tráng miệng dân dã, được nhiều người yêu thích nhờ vị thanh mát và ngon miệng. Bánh lọt làm từ bột năng và lá dứa, khi ăn thường được chan thêm nước cốt dừa béo ngậy, đường thốt nốt và đá lạnh. Đây là món ăn giải nhiệt hoàn hảo cho những ngày nắng nóng. Đây là món ăn gắn liền với ký ức tuổi thơ của nhiều người dân miền Tây.",
    origin: "Việt Nam",
    tags: ["bánh chè", "lá dứa", "thạch", "mát lạnh", "bột năng"],
    category: "68ab1ae8145f62e0428edf88", // Bánh Luộc
    image: { main: "/public/uploads/cakes/banhlot.jpg" },
  },
  {
    name: "Bánh Phục Linh",
    englishName: "Banh Phuc Linh (Tapioca Coconut Cake)",
    description:
      "Bánh Phục Linh là món bánh truyền thống của Việt Nam, có nguồn gốc từ Quảng Ngãi và Huế nhưng cũng phổ biến ở miền Tây Nam Bộ, nổi tiếng với sự tinh xảo, mềm mịn, tan trong miệng và hương thơm dịu nhẹ của lá dứa. Bánh được làm từ các nguyên liệu đơn giản như bột năng hoặc bột bình tinh, đường, và nước cốt dừa, với màu sắc tự nhiên từ lá dứa, củ dền, hoặc nghệ. Với nhiều hoa văn đẹp mắt, bánh Phục Linh không chỉ là một món tráng miệng ngon mà còn là biểu tượng của sự gắn kết gia đình và là món quà ý nghĩa trong các dịp lễ Tết.",
    origin: "Quảng Ngãi",
    tags: ["bánh bột nén", "bột năng", "Tết", "dừa", "khuôn gỗ", "bánh in"],
    category: "68ab1ae8145f62e0428edf89", // Bánh Sống
    image: { main: "/public/uploads/cakes/banhphuclinh.jpg" },
  },
  {
    name: "Bánh Pía",
    englishName: "Vietnamese Durian Pastry",
    description:
      "Bánh pía là một loại bánh ngọt đặc sản của Sóc Trăng, có nguồn gốc từ bánh trung thu của người Triều Châu. Bánh có lớp vỏ mỏng, nhiều lớp, bên trong là nhân đậu xanh, sầu riêng, đôi khi có thêm trứng muối, tạo nên hương vị đặc trưng, béo ngậy. Bánh pía thường được thưởng thức cùng trà, đặc biệt là vào dịp Tết Trung Thu.",
    origin: "Sóc Trăng",
    tags: ["bánh ngọt", "sầu riêng", "nhiều lớp", "mooncake-style"],
    category: "68ab1ae8145f62e0428edf87", // Bánh Nướng
    image: { main: "/public/uploads/cakes/banhpia.jpg" },
  },
  {
    name: "Bánh Tai Yến",
    englishName: "Vietnamese Bird's Nest Cake",
    description:
      "Bánh tai yến có hình dạng giống chiếc tổ chim yến, với phần giữa bánh phồng lên và viền ngoài giòn rụm. Loại bánh này được làm từ bột gạo, nước cốt dừa và đường, sau đó chiên giòn. Khi cắn vào, bạn sẽ cảm nhận được lớp ngoài giòn tan và phần ruột bánh mềm xốp. Bánh tai yến thường xuất hiện trong các buổi tiệc, lễ hội của người Nam Bộ. Vị béo ngậy của nước cốt dừa cùng với sự giòn tan của bánh tạo nên một món ăn hấp dẫn, khó cưỡng.",
    origin: "Tây Nam Bộ",
    tags: ["bánh chiên", "giòn", "dừa", "món lễ"],
    category: "68ab1ae8145f62e0428edf86", // Bánh Chiên
    image: { main: "/public/uploads/cakes/banhtaiyen.jpg" },
  },
  {
    name: "Bánh Tằm Bì",
    englishName: "Vietnamese Steamed Rice Noodles With Pork Skin",
    description:
      "Bánh tằm bì là một món ăn đặc sản nổi tiếng của miền Tây Nam Bộ, Việt Nam, đặc biệt là ở Cần Thơ. Món ăn này được làm từ bánh tằm (sợi bánh được làm từ bột gạo, có hình dạng giống con tằm) và bì (da heo thái sợi, thường được trộn với thính). Bánh tằm bì thường được ăn kèm với nước cốt dừa, rau sống, dưa leo, và nước mắm chua ngọt.",
    origin: "Tây Nam Bộ",
    tags: ["bánh hấp", "bì heo", "mắm nêm", "rau sống", "Tây Nam Bộ"],
    category: "68ab1ae8145f62e0428edf85", // Bánh Hấp
    image: { main: "/public/uploads/cakes/banhtambi.jpg" },
  },
  {
    name: "Bánh Tằm Khoai Mì",
    englishName: "Vietnamese Steamed Cassava Noodles With Grated Coconut",
    description:
      "Bánh tằm khoai mì là món bánh độc đáo, kết hợp giữa bột khoai mì và nước cốt dừa. Bánh có hình dạng giống sợi tằm, được phủ lên lớp nước cốt dừa béo ngậy và lớp dừa nạo thơm lừng. Khi ăn, bánh có vị ngọt nhẹ, dẻo dai và đặc biệt hấp dẫn bởi sự hòa quyện của các nguyên liệu tự nhiên. Món bánh này không chỉ ngon mà còn mang ý nghĩa tượng trưng cho sự chăm chỉ, cần cù của người dân miền Tây. Bánh tằm khoai mì là món ăn vặt quen thuộc của nhiều thế hệ người dân Nam Bộ.",
    origin: "Tây Nam Bộ",
    tags: ["bánh hấp", "khoai mì", "dừa", "bột khoai mì", "món vặt"],
    category: "68ab1ae8145f62e0428edf85", // Bánh Hấp
    image: { main: "/public/uploads/cakes/banhtamkhoaimi.jpg" },
  },
  {
    name: "Bánh Tét",
    englishName: "Vietnamese Sticky Rice Cake",
    description:
      'Bánh tét là một loại bánh hình trụ dài, được gói trong lá chuối và là một món ăn truyền thống không thể thiếu trong dịp Tết của người miền Nam Việt Nam. Bánh tét có hai loại nhân chính là nhân mặn (thịt mỡ, đậu xanh) và nhân ngọt (chuối). Tên gọi "bánh tét" xuất phát từ cách người ta "tét" (cắt) bánh ra để ăn.',
    origin: "Việt Nam",
    tags: ["Tết", "bánh chưng", "đậu xanh", "mắm tôm", "lá chuối"],
    category: "68ab1ae8145f62e0428edf88", // Bánh Luộc
    image: { main: "/public/uploads/cakes/banhtet.jpg" },
  },
  {
    name: "Bánh Cuốn Ngọt",
    englishName: "Vietnamese Sweet Steamed Rice Cake",
    description:
      "Bánh cuốn ngọt, hay còn gọi là bánh ướt ngọt, là một món bánh tráng miệng phổ biến ở miền Tây Việt Nam, có lớp vỏ bánh mỏng, mềm dẻo, thường có màu sắc bắt mắt như xanh lá dứa, trắng, hoặc tím, và nhân đậu xanh, dừa béo ngậy. Món bánh này thường được ăn kèm với nước cốt dừa, mè rang và có thể chấm với một chút muối mè để tăng thêm hương vị.",
    origin: "Miền Nam",
    tags: ["bánh ướt", "nước cốt dừa", "món ngọt", "miền Tây", "bánh hấp"],
    category: "68ab1ae8145f62e0428edf85", // Bánh Hấp
    image: { main: "/public/uploads/cakes/banhuotngot.jpg" },
  },
  {
    name: "Bánh Xèo",
    englishName: "Vietnamese Savory Pancake",
    description:
      'Bánh xèo là một món bánh truyền thống của Việt Nam, nổi tiếng với lớp vỏ mỏng, giòn và nhân đa dạng, thường được làm từ bột gạo, nghệ, và các loại nhân như tôm, thịt, giá, đậu xanh, và nhiều loại rau sống khác. Tên gọi "bánh xèo" xuất phát từ âm thanh "xèo xèo" khi bột gạo được đổ vào chảo dầu nóng. Bánh xèo thường được ăn kèm với nước chấm chua ngọt và các loại rau sống tươi mát.',
    origin: "Việt Nam (phổ biến ở Miền Trung và Miền Tây)",
    tags: ["bánh chiên", "tôm", "giòn", "rau sống"],
    category: "68ab1ae8145f62e0428edf86", // Bánh Chiên
    image: { main: "/public/uploads/cakes/banhxeo.jpg" },
  },
  {
    name: "Bánh Khọt",
    englishName: "Vietnamese Mini Savory Pancake",
    description:
      "Bánh khọt là món bánh đặc sản nổi tiếng của miền Nam Việt Nam, đặc biệt là Vũng Tàu, với vỏ bánh vàng giòn, thơm béo làm từ bột gạo và nước cốt dừa, kết hợp với nhân tôm tươi và mỡ hành. Khi ăn, bánh thường được cuốn với rau sống tươi mát, dưa leo và chấm cùng nước mắm chua ngọt đậm đà, tạo nên sự hòa quyện độc đáo giữa giòn, ngọt, béo và thanh mát.",
    origin: "Vũng Tàu",
    tags: ["bánh chiên", "tôm", "củ cải ngâm", "miền Nam", "nước mắm"],
    category: "68ab1ae8145f62e0428edf86", // Bánh Chiên
    image: { main: "/public/uploads/cakes/banhkhot.jpg" },
  },
];


module.exports = cakeData;

// Chèn dữ liệu vào MongoDB
Cake.insertMany(cakeData)
  .then(() => {
    console.log("Đã thêm dữ liệu bánh thành công!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Lỗi khi thêm dữ liệu:", error);
    mongoose.connection.close();
  });
