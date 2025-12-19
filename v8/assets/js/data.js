export const demoUsers = [
  { id:"u1", name:"Alicia", age:27, district:"Central", verified:true, vip:false, bio:"喜歡慢跑、煮飯。想搵一個長期伴侶。", tags:["steady","family","fitness"], status:"active" },
  { id:"u2", name:"Carmen", age:29, district:"TST", verified:false, vip:true, bio:"藝術/設計。更重視溝通與價值觀。", tags:["art","deep talk"], status:"active" },
  { id:"u3", name:"Iris", age:25, district:"Causeway Bay", verified:true, vip:false, bio:"金融。週末鍾意行山同咖啡。", tags:["hiking","coffee"], status:"active" },
  { id:"u4", name:"Yuki", age:28, district:"Wan Chai", verified:false, vip:false, bio:"教育。想建立穩定家庭節奏。", tags:["teacher","calm"], status:"active" },
  { id:"u5", name:"Mina", age:30, district:"Sheung Wan", verified:true, vip:true, bio:"市場營銷。細水長流型。", tags:["marketing","steady"], status:"active" },
  { id:"u6", name:"Joyce", age:26, district:"Kowloon Tong", verified:true, vip:false, bio:"重視誠實、界線同安全感。", tags:["honest","boundaries"], status:"pending" },
  { id:"u7", name:"Ken", age:24, district:"Tsuen Wan", verified:false, vip:false, bio:"新用戶（待審批示意）。", tags:["new"], status:"pending" },
  { id:"u8", name:"Spammer123", age:22, district:"Unknown", verified:false, vip:false, bio:"(flagged)", tags:["spam"], status:"banned" },
];

export const demoChats = {
  u1: [
    { who:"them", type:"text", text:"Hi 👋 我係 Alicia。今日嘅配對好自然～想慢慢了解你。", ts:"11:21" },
    { who:"me", type:"text", text:"我都係～我哋可以先喺度傾下，之後再決定要唔要轉 WhatsApp。", ts:"11:22" },
  ],
  u2: [
    { who:"them", type:"text", text:"你鍾意行山定海邊？", ts:"Yesterday" }
  ]
};

export const replyPool = {
  greeting: ["好開心遇到你，一齊慢慢傾！", "Thanks for sharing，你今日過得點？"],
  hobbies: ["我最近愛上煮飯，你有冇想試的新菜？", "週末會去行山／咖啡店，你有冇推介？"],
  values: ["我重視尊重同安全感，你覺得呢？", "我鍾意慢熱，但希望彼此真誠。"],
  plan: ["不如先視像傾 10 分鐘再決定下一步？", "下次可以一齊試新咖啡店，點睇？"]
};
