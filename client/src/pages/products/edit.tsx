import { IResourceComponentsProps } from "@refinedev/core";
import {useState} from 'react';
import { useGetIdentity } from "@refinedev/core";
import { useForm } from '@refinedev/react-hook-form';
import { FieldValues } from "react-hook-form";
import { useGo } from "@refinedev/core";
import Form from 'components/common/Form';
//import { MuiEditInferencer } from "@refinedev/inferencer/mui";

export const ProductEdit: React.FC<IResourceComponentsProps> = () => {
  const go = useGo();
  const {data: user} = useGetIdentity<{
    email:string
  }>();
  const [productImage, setProductImage] = useState({ name:'', url: ''});
  const { refineCore: {onFinish, formLoading}, register, handleSubmit, control} = useForm();

  const handleImageChange = (file: File) => {
    const reader = (readFile: File) =>
        new Promise<string>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = () => resolve(fileReader.result as string);
            fileReader.readAsDataURL(readFile);
        });

    reader(file).then((result: string) =>
    setProductImage({ name: file?.name, url: result }),
    );
};
  const onFinishHandler = async (data: FieldValues) => {
    if(!productImage.name) return alert('Please select an image');

    await onFinish({...data, photo: productImage.url, email: user?.email?? ''})
  };

  return (
    <Form
    type="Create"
    register={register}
    onFinish={onFinish}
    formLoading={formLoading}
    handleSubmit={handleSubmit}
    handleImageChange = {handleImageChange}
    onFinishHandler = {onFinishHandler}
    productImage={productImage}
    control={control}
    />
    //<MuiCreateInferencer />;
  )
};
