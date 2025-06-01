"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/lib/constants";
import { BooksSearchQueryType } from "@/lib/types";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Title from "./Title";
import { Input } from "./ui/input";

const BooksSearch = (props: { query: BooksSearchQueryType }) => {
  const [search, setSearch] = useState<BooksSearchQueryType>(props.query);

  const router = useRouter();
  const pathname = usePathname();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);

  const formRef = useRef<HTMLDivElement>(null);

  // On component mount, add a window event listener to add a class to the form that shrinks it on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (formRef.current) {
        if (window.scrollY > formRef.current.offsetHeight) {
          formRef.current.classList.add("form-sticky-active");
          formRef.current.querySelectorAll("*").forEach((child) => {
            child.classList.add("form-sticky-active");
          });
        } else {
          formRef.current.classList.remove("form-sticky-active");
          formRef.current.querySelectorAll("*").forEach((child) => {
            child.classList.remove("form-sticky-active");
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleChangeInput = (
    key: keyof BooksSearchQueryType,
    value: string
  ) => {
    const updatedSearch = { ...search, [key]: value };

    setSearch(updatedSearch);

    const searchParams = new URLSearchParams(updatedSearch);
    router.replace(`${pathname}?${searchParams.toString()}`);
  };

  const handleClearInput = (key: keyof BooksSearchQueryType) => {
    const updatedSearch = { ...search, [key]: "" };
    setSearch(updatedSearch);

    const searchParams = new URLSearchParams(updatedSearch);
    router.replace(`${pathname}?${searchParams.toString()}`);

    if (key === "title" && titleInputRef.current) {
      titleInputRef.current.focus();
    } else if (key === "author" && authorInputRef.current) {
      authorInputRef.current.focus();
    }
  };

  return (
    <div
      ref={formRef}
      className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500"
    >
      <Title>Recherche de livres</Title>
      <div className="relative">
        <Input
          value={search.title}
          ref={titleInputRef}
          placeholder="Titre"
          onChange={(e) => handleChangeInput("title", e.target.value)}
        />
        <X
          onClick={() => handleClearInput("title")}
          className="absolute right-2 top-2 cursor-pointer"
        />
      </div>

      <div className="relative">
        <Input
          value={search.author}
          ref={authorInputRef}
          placeholder="Auteur(e)"
          onChange={(e) => handleChangeInput("author", e.target.value)}
        />
        <X
          onClick={() => handleClearInput("author")}
          className="absolute right-2 top-2 cursor-pointer"
        />
      </div>
      <div className="relative">
        <Select
          value={search.lang}
          onValueChange={(e) => handleChangeInput("lang", e)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Langue" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <X
          onClick={() => handleClearInput("lang")}
          className="absolute right-2 top-2 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default BooksSearch;
