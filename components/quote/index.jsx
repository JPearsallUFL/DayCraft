import { useEffect, useState } from "react";

export default function Quote(){

    let [{quote,author}, setQuote,]=useState({
        quote: "",
        author: "",
    });
    
    async function getQuote(){
        const res = await fetch("https://api.quotable.io/quotes/random")
        const json = await res.json()
        setQuote({quote:json[0].content, author:json[0].author})
    }

    useEffect(() => {getQuote();},[]);

    return(
        <div className="quote">
            <p>{quote}</p>
            <div className="break"></div>
            <p>~{author}</p>
        </div>
    )
}