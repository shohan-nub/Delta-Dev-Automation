import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"


const splint=new RecursiveCharacterTextSplitter({
    chunkSize:300,
    chunkOverlap:30
});

export async function lchunk(content:string) {
    return splint.splitText(content);
    
}