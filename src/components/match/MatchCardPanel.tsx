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
        <div className="flex flex-row items-center justify-between gap-6 border-b border-neutral-100 p-3 last:border-b-0 bg-blue-500 w-60 h-60">
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