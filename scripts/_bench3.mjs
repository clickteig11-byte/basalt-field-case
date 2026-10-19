import sharp from "sharp";
const SRC="/Users/caleblickteig/Documents/outdoors chest site/image_20261016_211812_frames";
const idx=[1,25,55,85,110,140,170,190,205,220];
const cfgs=[
  {label:"avif 1152 q45", w:1152, q:45, eff:4},
  {label:"avif 1152 q50", w:1152, q:50, eff:4},
  {label:"avif 1280 q45", w:1280, q:45, eff:4},
  {label:"avif 1024 q50", w:1024, q:50, eff:4},
];
for (const c of cfgs){
  let total=0,n=0;
  for (const i of idx){
    const name=`frame_${String(i).padStart(3,"0")}.jpg`;
    const b=await sharp(`${SRC}/${name}`).resize({width:c.w,withoutEnlargement:true}).avif({quality:c.q,effort:c.eff}).toBuffer();
    total+=b.length;n++;
  }
  console.log(`${c.label}  avg=${(total/n/1024).toFixed(0)}K  110frames=${(total/n*110/1048576).toFixed(1)}MB`);
}
