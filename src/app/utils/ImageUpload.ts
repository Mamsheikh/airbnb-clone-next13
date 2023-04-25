export interface ImgType {
  src: string;
}

export const imagesUpload = async (images: File[]) => {
  let imgArr: ImgType[] = [];
  for (const item of images) {
    const formData = new FormData();

    // if(item.camera){
    //     formData.append("file", item.camera)
    // }else{
    // }
    formData.append('file', item);

    formData.append('upload_preset', 'airbnb');
    formData.append('cloud_name', 'mamsheikh');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/mamsheikh/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await res.json();
    imgArr.push({ src: data.secure_url });
  }
  return imgArr;
};
