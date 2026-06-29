import { useState } from "react";
import UploadZone from "../ui/UploadZone";
import DetectionCard from "../dashboard/DetectionCard";

const icons: Record<string,string> = {
  person:"👤",
  car:"🚗",
  backpack:"🎒",
  laptop:"💻",
  bottle:"🍾"
};

export default function ImageUploader(){

const [preview,setPreview]=useState("");

const [detections,setDetections]=useState<Record<string,number>>({});

const uploadImage=async(file:File)=>{

setPreview(URL.createObjectURL(file));

const fd=new FormData();

fd.append("file",file);

const res=await fetch(
"http://localhost:8000/detect-image",
{
method:"POST",
body:fd
});

const data=await res.json();

const counts:Record<string,number>={};

data.detections.forEach((d:any)=>{

counts[d.class]=(counts[d.class]||0)+1;

});

setDetections(counts);

};

return(

<div className="glass-card">

<h2>🖼 Image Detection</h2>

<UploadZone
title="Upload Image"
accept={{"image/*":[]}}
onFile={uploadImage}
/>

{preview&&(

<div className="live-preview">

<img src={preview}/>

</div>

)}

<div className="detection-grid">

{Object.entries(detections).map(([label,count])=>(

<DetectionCard

key={label}

label={label}

count={count}

icon={icons[label]??"📦"}

/>

))}

</div>

</div>

);

}