import { Form, notification } from "antd";
import React, { FormEvent, useMemo, useRef, useState } from "react";
import ReactQuill, { type ReactQuillProps } from "react-quill";
import { useUploadThing } from "@/app/api/uploadthing/hooks";
import { NormalInput } from "../input";
import Button from "../general/button";
import Image from "next/image";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { RootState } from "@/app/_lib/store";
import ImageUploader from "../general/image-uploader";
import cancel from "@/assets/icons/cancel.png";
import PostPage from "../post-page";
import 'react-quill/dist/quill.snow.css';
import { Familjen_Grotesk, Jacques_Francois, Merriweather as Mw, Roboto as Rb, Bree_Serif } from "next/font/google";
import { User } from "@/app/_lib/type";

const Default = Familjen_Grotesk({
  weight: ["400", "400", "700"],
  subsets: ["latin"]
});
const Jacques = Jacques_Francois({
  weight: ["400"],
  subsets: ["latin"]
})
const Roboto = Rb({
  weight: ["400", "400", "500", "700"],
  subsets: ["latin"]
});
const BreeSerif = Bree_Serif({
  weight: ["400"],
  subsets: ["latin"]
});
const Merriweather = Mw({
  weight: ["400", "700", "900"],
  subsets: ["latin"]
});
const themesConfig = {
  Merriweather,
  BreeSerif,
  Roboto,
  Jacques,
  Default
}

const themes = ["Roboto", "BreeSerif", "Jacques", "Merriweather", "Default"] as const;

interface EditorProps extends ReactQuillProps {
  post: string,
  postOnChange: (v: any) => void,
  heading: string,
  headerOnChange: (v: any) => void,
  synopsis: string,
  synopsisOnChange: (v: any) => void,
  coverLink: string,
  coverLinkOnChange: (v: any) => void,
  theme: typeof themes[number],
  setTheme: (v: any) => void,
}
function Editor(props: EditorProps) {
  //@ts-ignore
  const { info } = useAppSelector((state: RootState) => state.user)
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputCoverImageRef = useRef<HTMLInputElement | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);
  const { post, postOnChange, heading, headerOnChange, synopsis, synopsisOnChange, coverLink, coverLinkOnChange, theme, setTheme } = props;
  const [showPreview, setShowPreview] = useState(false);
  const [linkValue, setLinkValue] = useState({
    text: "",
    href: ""
  });
  const [showLinkInsert, setShowLinkInsert] = useState(false);
  const themesOptions = useMemo(() => themes.map((val) => ({
    label: val,
    value: val
  })), []);

  const { startUpload, isUploading } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: (res) => {
        const url = res[0].url;

        postOnChange((prev: string) => (prev || "") + `<p><img src="${url}" alt=""/></p>`);

      },
      onUploadError: () => {
        notification.error({ message: "error occurred while uploading" });
      },
    },
  );
  const { startUpload: startUploadCoverImage, isUploading: isUploadingCoverPhoto } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: (res) => {
        const url = res[0].url;
        coverLinkOnChange(url);
      },
      onUploadError: () => {
        notification.error({ message: "error occurred while uploading" });
      },
    },
  );
  function handleLinkInsertion() {
    setShowLinkInsert(true);
  }
  function handleImageSelection(v: any) {
    const target: HTMLInputElement = v.target;
    const files = target?.files;
    const fileList = [files?.[0]] as unknown as File[];
    if (fileList && fileList[0] && fileList[0].type.startsWith("image")) {
      startUpload(fileList);
    } else {
      notification.error({
        message: "invalid file format, only images are allowed!"
      });
    }
  }
  function handleCoverImageSelection(v: any) {
    const target: HTMLInputElement = v.target;
    const files = target?.files;
    const fileList = [files?.[0]] as unknown as File[];
    if (fileList && fileList[0] && fileList[0].type.startsWith("image")) {
      startUploadCoverImage(fileList);
    } else {
      notification.error({
        message: "invalid file format, only images are allowed!"
      })
    }
  }

  function openSelectImage() {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }
  function openSelectCoverImage() {
    if (inputCoverImageRef.current) {
      inputCoverImageRef.current.click();
    }
  }


  const handleLinkChange = (e: any) => {
    const { name, value } = e.target;

    setLinkValue(prev => ({ ...prev, [name]: value }))
  }
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "heading") {
      headerOnChange(value)
    }
    if (name === "synopsis") {
      synopsisOnChange(value)
    }
  }
  const handleThemChange = (e: any) => {
    setTheme(e);
  }
  const handleCancelLink = () => {
    setShowLinkInsert(false);
    setLinkValue({
      text: '',
      href: ''
    })
  }
  const insertLink = (v: FormEvent) => {
    postOnChange((prev: string) => (prev || "") + `<a href="${linkValue.href}">${linkValue.text}</a>`)
    handleCancelLink();
  }

  return (
    <>
      <div className="w-full preview pb-[10px] relative">
        <section className="flex flex-col gap-2 w-full mb-1">
          {/* cover photo */}
          <div className="mb-16">
            <ImageUploader url={coverLink} setUrl={coverLinkOnChange} className="w-full h-[200px]" text={coverLink ? "change cover photo" : "upload cover photo"} removeLink={() => {
              coverLinkOnChange("");
            }} showIsDraggable />
          </div>
          <div className="w-full">
            <NormalInput type="select" className={`select `} label="Theme" name="theme" onChange={handleThemChange} value={theme} options={themesOptions} defaultValue="Default" />
          </div>
          {/* insert heading */}
          <div className="w-full">
            <NormalInput type="text" label="Heading" name="heading" onChange={handleInputChange} value={heading} />
          </div>
          {/* synopsis */}
          <div className="w-full">
            <NormalInput type="textarea" label="Synopsis" name="synopsis" onChange={handleInputChange} extraProps={{
              height: 80,
            }} value={synopsis} />
          </div>
        </section>
        <section className="text-editor">
          <div className={`absolute z-[11] top-0 left-0 w-screen h-screen flex justify-center items-center ${!showLinkInsert && "hidden"}`}>
            <div className="w-[380px] max-w-[95%] h-[200px] bg-black bg-opacity-10 shadow-xl rounded-[10px] px-4 ">
              <div className="w-[80px] ml-auto">
                <Button type="button" adjustSize="small" text="cancel" onClick={handleCancelLink} theme="danger" />
              </div>
              <Form onFinish={insertLink} className=" flex flex-col gap-2 items-center justify-center w-full h-full">
                <NormalInput label="Text" name="text" value={linkValue.text} onChange={handleLinkChange} required />
                <NormalInput label="Link" name="href" value={linkValue.href} onChange={handleLinkChange} required />
                <Button text="Insert Link" type="submit" />
              </Form>
            </div>
          </div>

          <input hidden type="file" accept="image/*" name="image" ref={inputRef} onChange={handleImageSelection} />
          <input hidden type="file" accept="image/*" name="image" ref={inputCoverImageRef} onChange={handleCoverImageSelection} />
          <div className="min-h-[200px]">

            <div id="toolbar">
              <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
                <option value="1" />
                <option value="2" />
                <option selected />
              </select>
              <button className="ql-bold" />
              <button className="ql-italic" />
              <button className="ql-underline" />
              <button className="ql-list" value="bullet" />
              <button className="ql-list" value="ordered" />
              <select className="ql-color">
                <option value="red" />
                <option value="green" />
                <option value="blue" />
                <option value="orange" />
                <option value="violet" />
                <option value="#d0d1d2" />
                <option selected />
              </select>
              <button className="ql-code" />
              <button className="ql-blockquote" />
              <button className="ql-link" onClick={handleLinkInsertion} />
              <button className="ql-image" onClick={openSelectImage} />
            </div>
            {isUploading && <Button theme="light" loading={isUploading} adjustSize="medium" text="inserting image" />}
            <ReactQuill
              onChange={postOnChange}
              value={post}
              readOnly={isUploading}
              placeholder={"Write Post..."}
              modules={editorModules}
              formats={formats}
              theme={"snow"}
              ref={quillRef}
            />
          </div>

        </section>
      </div>
      <div className="absolute left-[20px] sm:left-[230px] md:left-[280px] bottom-[60px] z-[6]">
        {!showPreview && <Button text="preview" className="!rounded-[xl] px-2" theme="light" onClick={() => { setShowPreview(prev => !prev) }} />}
      </div>
      {
        showPreview && (
          <div className="fixed top-0 left-0 h-[100vh] rounded-xl  w-[100vw] max-h-[100vh] mx-auto p-2 sm:p-4 bg-[#fff] text-black overflow-y-auto py-4 pb-10 z-[20]">
            <div className="w-full flex justify-end">
              <Button className="!rounded-full !ml-auto !w-[35px] !h-[35px] px-2 !border-none !outline-none !bg-transparent relative" theme="light" onClick={() => setShowPreview(prev => !prev)}>
                <div>
                  <Image src={cancel} fill alt="cancel" objectFit="cover" objectPosition="center" />
                </div>
              </Button>
            </div>
            <PostPage post={{ content: post, authorDetails: info ?? undefined, title: heading, coverPhoto: coverLink, theme: theme ?? "Default" }} user={info as User} />
          </div>
        )
      }

    </>

  );
}
//@ts-ignore
const editorModules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      link: function () {
      },
      image: function () { }
    },
  },
  clipboard: {
    matchVisual: false,
  },

};

/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
//@ts-ignore
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color"
];


export default Editor
