export type Category = "all" | "1-of-1" | "dresses" | "sleepwear" | "lingerie";

export interface Product {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  priceNum: number;
  oldPrice?: string;
  image: string;
  category: Exclude<Category, "all">;
  isOneOfOne?: boolean;
  colors?: { name: string; hex: string; image: string }[];
  sizes?: string[];
  thumbnails?: string[];
}

export const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "سُلطة المُخمل",
    subtitle: "قطعة يتيمة · ١ من ١",
    description:
      "قطعة مصممة بعناية عشان تبرز جمالك. قماش مخملي فاخر ناعم على البشرة يخليك واثقة من نفسك في كل خطوة. صُممت لتُلبس مرة واحدة فقط، لأنك وحدك تستاهلينها.",
    price: "٨,٩٠٠ ر.س",
    priceNum: 8900,
    oldPrice: "١٢,٠٠٠ ر.س",
    image: "/images/shaghaf_masterpiece_1772392229139.png",
    category: "1-of-1",
    isOneOfOne: true,
    colors: [
      { name: "عنابي ملكي", hex: "#4B1E28", image: "/images/shaghaf_masterpiece_1772392229139.png" },
      { name: "أسود أونيكس", hex: "#1a1a1a", image: "/images/couture_one_1772392258498.png" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    thumbnails: [
      "/images/shaghaf_masterpiece_1772392229139.png",
      "/images/couture_one_1772392258498.png",
      "/images/couture_two_1772392277554.png",
      "/images/lace_details_1772392328266.png",
    ],
  },
  {
    id: 2,
    title: "أُفق الكوتور",
    subtitle: "فستان سهرة راقٍ",
    description:
      "تصميم إطلالة لا تُنسى. قماش ناعم يتدفق مع كل حركة، وتفاصيل دقيقة تجعلكِ محور الاهتمام في أي مناسبة. لأن كل مناسبة تستحق إطلالة أسطورية.",
    price: "٤,٥٠٠ ر.س",
    priceNum: 4500,
    oldPrice: "٦,٥٠٠ ر.س",
    image: "/images/couture_one_1772392258498.png",
    category: "dresses",
    colors: [
      { name: "أسود أونيكس", hex: "#1a1a1a", image: "/images/couture_one_1772392258498.png" },
      { name: "عنابي ملكي", hex: "#4B1E28", image: "/images/shaghaf_masterpiece_1772392229139.png" },
    ],
    sizes: ["S", "M", "L"],
    thumbnails: [
      "/images/couture_one_1772392258498.png",
      "/images/shaghaf_masterpiece_1772392229139.png",
      "/images/couture_two_1772392277554.png",
    ],
  },
  {
    id: 3,
    title: "نعومة الفجر",
    subtitle: "بيجامة حرير فاخرة",
    description:
      "لأن لحظات الراحة تستاهل الفخامة. حرير ناعم يلمس بشرتك بلطف في كل ليلة، مع تصميم أنيق يخليك تحسي بالرفاهية حتى في خلوتك.",
    price: "١,٨٠٠ ر.س",
    priceNum: 1800,
    oldPrice: "٢,٥٠٠ ر.س",
    image: "/images/silk_sleepwear_1772392297928.png",
    category: "sleepwear",
    colors: [
      { name: "روز ناعم", hex: "#C87D8A", image: "/images/silk_sleepwear_1772392297928.png" },
      { name: "أبيض لؤلؤي", hex: "#F5F5F5", image: "/images/sleepwear_4_1772393732906.png" },
    ],
    sizes: ["XS", "S", "M", "L"],
    thumbnails: [
       "/images/silk_sleepwear_1772392297928.png",
       "/images/sleepwear_4_1772393732906.png",
    ],
  },
  {
    id: 4,
    title: "رقة الحرير",
    subtitle: "فستان كوتور راقٍ",
    description:
      "قطعة تعبّر عن رقتك وأنوثتك. تفاصيل مصنوعة باحتراف وقماش فاخر يجعلكِ تشعرين بالفرق من اللحظة الأولى. صُممت لأجمل لحظاتك.",
    price: "٣,٢٠٠ ر.س",
    priceNum: 3200,
    oldPrice: "٤,٥٠٠ ر.س",
    image: "/images/couture_two_1772392277554.png",
    category: "dresses",
    colors: [
      { name: "زيتي غامق", hex: "#2D3B2A", image: "/images/couture_two_1772392277554.png" },
      { name: "عنابي ملكي", hex: "#4B1E28", image: "/images/shaghaf_masterpiece_1772392229139.png" },
    ],
    sizes: ["S", "M", "L"],
    thumbnails: [
      "/images/couture_two_1772392277554.png",
      "/images/shaghaf_masterpiece_1772392229139.png",
    ],
  },
  {
    id: 5,
    title: "تفاصيل الدانتيل",
    subtitle: "طقم دانتيل ناعم",
    description:
      "دانتيل فرنسي ناعم ورقيق يحتضن جمالكِ بأناقة. تفاصيل مطرّزة بعناية تعكس ذوقكِ الرفيع في أخص لحظاتكِ.",
    price: "٩٥٠ ر.س",
    priceNum: 950,
    image: "/images/lace_details_1772392328266.png",
    category: "lingerie",
  },
  {
    id: 6,
    title: "ليلة الساتان",
    subtitle: "قميص نوم ساتان",
    description:
      "ساتان فاخر بلمسة ملكية. يمنحكِ الراحة والأناقة معاً في ليالٍ هادئة ومميزة. تصميم كلاسيكي لا يخرج من الموضة.",
    price: "١,٢٠٠ ر.س",
    priceNum: 1200,
    image: "/images/sleepwear_4_1772393732906.png",
    category: "sleepwear",
  },
  {
    id: 7,
    title: "سرداب الأناقة",
    subtitle: "قطعة يتيمة · ١ من ١",
    description:
      "قطعة مفصّلة باحتراف لا يُمكن تكرارها. كل خيط يحكي قصة عناية واهتمام بالتفاصيل. إذا كنتِ تبحثين عن قطعة تتفرد بها، هذه هي.",
    price: "١٢,٠٠٠ ر.س",
    priceNum: 12000,
    image: "/images/sleepwear_5_1772393869461.png",
    category: "1-of-1",
    isOneOfOne: true,
  },
  {
    id: 8,
    title: "هدوء الكتان",
    subtitle: "بيجامة كتان مريحة",
    description:
      "كتان طبيعي ناعم يسمح لبشرتك بالتنفس. تصميم فضفاض مريح يمنحكِ الراحة التامة في أوقات الاسترخاء.",
    price: "٩٨٠ ر.س",
    priceNum: 980,
    image: "/images/sleepwear_6_1772394511509.png",
    category: "sleepwear",
  },
  {
    id: 9,
    title: "مرآة الفينوس",
    subtitle: "طقم لانجري فاخر",
    description:
      "مصمم ليبرز جمالكِ ببراعة. أقمشة فاخرة وتفاصيل راقية تجعلكِ تشعرين بالقوة والأنوثة معاً.",
    price: "١,١٠٠ ر.س",
    priceNum: 1100,
    image: "/images/sleepwear_7_1772394528628.png",
    category: "lingerie",
  },
  {
    id: 10,
    title: "قصيدة المخمل",
    subtitle: "فستان مخملي راقٍ",
    description:
      "مخمل فاخر يعانق جسمكِ بأناقة تامة. تصميم كلاسيكي مع لمسات عصرية تجعلكِ مميزة في كل مكان تدخلينه.",
    price: "٥,٨٠٠ ر.س",
    priceNum: 5800,
    image: "/images/sleepwear_8_1772394548987.png",
    category: "dresses",
  },
  {
    id: 11,
    title: "شال الغيمة",
    subtitle: "روب ناعم فضفاض",
    description:
      "خفيف كالغيمة وناعم كالحرير. يلفّكِ بدفء ورفاهية في أوقات الاسترخاء، مع تصميم أنيق لا يُخجل من ارتدائه.",
    price: "٧٥٠ ر.س",
    priceNum: 750,
    image: "/images/sleepwear_3_1772393561702.png",
    category: "sleepwear",
  },
  {
    id: 12,
    title: "سرّ الزهر",
    subtitle: "طقم دانتيل رومانسي",
    description:
      "زهور الدانتيل تحكي قصة أنوثة هادئة وواثقة. قطعة مصنوعة باهتمام بالغ بالتفاصيل لأجمل لحظاتكِ الخاصة.",
    price: "١,٣٥٠ ر.س",
    priceNum: 1350,
    image: "/images/lace_details_1772392328266.png",
    category: "lingerie",
  },
];

export function getProductById(id: number): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}
