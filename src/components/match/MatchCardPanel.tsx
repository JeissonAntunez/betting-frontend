import Image from "next/image";
import Link from "next/link";
import { Match } from "@/types";
import { OddButton } from "./OddButton";


interface MatchCardProps {
    match: Match;  
}


export function MatchCardPanel({ match }: MatchCardProps) {
    const { homeTeam, awayTeam, status, liveMinute, mainMarket, tournament, isBoosted, boostLabel } = match;

    return (
        <div className="flex flex-row gap-3 border-b border-black-100 ">
            <div>
                <span>{new Date(match.startTime).toLocaleString(
                    "es-PE", {
                    day: "2-digit",
                    month: "2-digit",   
                    hour: "2-digit",
                    minute: "2-digit",
                })}</span>
            </div>
                
        </div>
    );

}