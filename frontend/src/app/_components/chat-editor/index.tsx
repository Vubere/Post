import { Form, notification } from "antd";
import React, { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import ReactQuill, { type ReactQuillProps } from "react-quill";
import { useUploadThing } from "@/app/api/uploadthing/hooks";
import { NormalInput } from "../input";
import Button from "../general/button";
import { User } from "@/app/_lib/type";
import sendIcon from "@/assets/icons/dashboard/send.png";
import 'react-quill/dist/quill.snow.css';
import Image from "next/image";

interface EditorProps extends ReactQuillProps {
  chatId: string;
  user: User | null;
  otherUser: User | undefined;
  sendMessage: (chat: string) => void;
  chat: string;
  setChat: React.Dispatch<React.SetStateAction<string>>;
}
function ChatEditor({ sendMessage, chat, setChat }: EditorProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  const [linkValue, setLinkValue] = useState({
    text: "",
    href: "",
  });
  const send = useCallback(() => {
    sendMessage(chat);
  }, [chat, sendMessage]);
  const [showLinkInsert, setShowLinkInsert] = useState(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const url = res[0].url;

      setChat(
        (prev: string) => (prev || "") + `<p><img src="${url}" alt=""/></p>`
      );
    },
    onUploadError: () => {
      notification.error({ message: "error occurred while uploading" });
    },
  });

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
        message: "invalid file format, only images are allowed!",
      });
    }
  }
  function openSelectImage() {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }

  const handleLinkChange = (e: any) => {
    const { name, value } = e.target;
    setLinkValue((prev) => ({ ...prev, [name]: value }));
  };
  const handleCancelLink = () => {
    setShowLinkInsert(false);
    setLinkValue({
      text: "",
      href: "",
    });
  };
  const insertLink = (v: FormEvent) => {
    setChat(
      (prev: string) =>
        (prev || "") + `<a href="${linkValue.href}">${linkValue.text}</a>`
    );
    handleCancelLink();
  };

  return (
    <>
      <div className="w-full  z-[15] bg-white">
        <section className="text-editor relative">
          <div
            className={`absolute z-[11] top-0 left-0 w-screen h-screen flex justify-center items-center ${!showLinkInsert && "hidden"
              }`}
          >
            <div className="w-[380px] max-w-[95%] h-[200px] bg-black bg-opacity-10 shadow-xl rounded-[10px] px-4 ">
              <div className="w-[80px] ml-auto">
                <Button
                  type="button"
                  adjustSize="small"
                  text="cancel"
                  onClick={handleCancelLink}
                  theme="danger"
                />
              </div>
              <Form
                onFinish={insertLink}
                className=" flex flex-col gap-2 items-center justify-center w-full h-full"
              >
                <NormalInput
                  label="Text"
                  name="text"
                  value={linkValue.text}
                  onChange={handleLinkChange}
                  required
                />
                <NormalInput
                  label="Link"
                  name="href"
                  value={linkValue.href}
                  onChange={handleLinkChange}
                  required
                />
                <Button text="Insert Link" type="submit" />
              </Form>
            </div>
          </div>

          <input
            hidden
            type="file"
            accept="image/*"
            name="image"
            ref={inputRef}
            onChange={handleImageSelection}
          />
          <div >

            {isUploading && (
              <Button
                theme="light"
                loading={isUploading}
                adjustSize="medium"
                text="inserting image"
              />
            )}
            <div className="grid grid-cols-[1fr_40px]">

              <ReactQuill
                onChange={setChat}
                value={chat}
                readOnly={isUploading}
                placeholder={"Send a message..."}
                modules={editorModules}
                formats={formats}
                theme={"snow"}
                ref={quillRef}
                className="![&.quill]:border ![&.quill]:border-gray-200 ![&.quill]:rounded-t-[10px] ![&_.ql-editor]:max-h-[80px] ![&.quill_div.ql-container]:border ![&.quill_.ql-container]:border-red-400 ![&_.ql-editor]:min-h-[80px] ![&_.ql-editor]:overflow-y-auto"
              />
              <div className="w-full h-full flex items-center justify-center">
                <button className="relative w-[20px] h-[20px] " onClick={send}>
                  <Image src={sendIcon} alt="" objectFit="contain" objectPosition="center" fill />
                </button>
              </div>
            </div>
            <div id="toolbar" className="border-b border-gray-200 bg-gray-50">
              <button className="ql-image" onClick={openSelectImage} />
              <button className="ql-bold" />
              <button className="ql-italic" />
              <button className="ql-underline" />
              <button className="ql-link" onClick={handleLinkInsertion} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
//@ts-ignore
const editorModules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      link: function () { },
      image: function () { },
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
  "color",
];

export default ChatEditor;
