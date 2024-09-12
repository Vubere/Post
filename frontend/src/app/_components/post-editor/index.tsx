import { Form, Modal, notification } from "antd";
import React, { FormEvent, useRef, useState } from "react";
import ReactQuill, { Quill, ReactQuillProps } from "react-quill";
import { UploadButton } from "../general/uploadthing-button";
import { useUploadThing } from "@/app/api/uploadthing/hooks";
import Input, { NormalInput } from "../input";
import Button from "../general/button";
import Image from "next/image";
import { useAppSelector } from "@/app/_lib/store/hooks";
import { RootState } from "@/app/_lib/store";


interface EditorProps extends ReactQuillProps {
  post: string,
  postOnChange: (v: any) => void,
  heading: string,
  headerOnChange: (v: any) => void,
  synopsis: string,
  synopsisOnChange: (v: any) => void,
  coverLink: string,
  coverLinkOnChange: (v: any) => void,
}
function Editor(props: EditorProps) {
  const { info } = useAppSelector((state: RootState) => state.user)
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputCoverImageRef = useRef<HTMLInputElement | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);
  const { post, postOnChange, heading, headerOnChange, synopsis, synopsisOnChange, coverLink, coverLinkOnChange } = props;
  const [showPreview, setShowPreview] = useState(false);
  const [linkValue, setLinkValue] = useState({
    text: "",
    href: ""
  });
  const [showLinkInsert, setShowLinkInsert] = useState(false);

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
      })
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
      <div className="w-full preview pb-[100px] relative">
        <section className="flex flex-col gap-2 w-full mb-1">
          {/* cover photo */}
          <div>
            {/* add cover photo */}
            <Button theme="dark" text={`${coverLink ? "Change" : "Upload"} Cover Photo`} onClick={openSelectCoverImage} loading={isUploadingCoverPhoto} />
            {coverLink && (
              <div>
                {/* remove cover photo */}
                <div className="w-full h-[300px] relative rounded-[10px]">
                  <Image src={coverLink} alt={heading} fill objectFit="cover" objectPosition="center" />
                </div>
              </div>
            )}
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
        </section>
      </div>
      <div className="absolute left-[20px] sm:left-[230px] md:left-[280px] bottom-[60px] z-[6]">
        {!showPreview && <Button text="preview" className="!rounded-[xl] px-2" theme="light" onClick={() => { setShowPreview(prev => !prev) }} />}
      </div>
      {
        showPreview && (
          <div className="fixed top-[10vh] left-[50%] translate-x-[-50%] h-[80vh] rounded-xl max-h-[90vh] w-[95vw] mx-auto p-4 bg-[#e7e7e7] text-black overflow-y-auto py-4">
            <div className="w-full flex justify-end">
              <Button text="x" className="!rounded-full !ml-auto !w-[35px] !h-[35px] px-2" theme="light" onClick={() => setShowPreview(prev => !prev)} />
            </div>
            {coverLink && <div className="w-full h-[300px] relative rounded-[30px]">
              <Image src={coverLink} alt={heading} fill objectFit="cover" objectPosition="center" />
            </div>}
            <div>
              <h1 className="text-black leading-[15%] font-bold text-[24px] xs:text-[32px] sm:text-[42px] md:text-[48px] lg:text-[54px] mb-[15px]">{heading}</h1>
              <p className="text-[#3d3d3d] text-[11px] xs:text-[14px] sm:text-[16px] md:text-[22px] italic">- {info?.fullName || "author"}</p>
            </div>


            <div className="[&_p]:text-grey-400 [&_p]:text-[12px] xs:[&_p]:text-[14px] sm:[&_p]:text-[16px] [&_a]:text-[#44f]" dangerouslySetInnerHTML={{ __html: post }} />
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
