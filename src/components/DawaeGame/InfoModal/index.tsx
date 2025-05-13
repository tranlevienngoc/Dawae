import React from "react";

interface InfoModalProps {
  onClose: () => void;
}

export default function InfoModal({ onClose }: InfoModalProps) {
  const CONTENT = [
    {
      title: "Why UgandanKnuckles.click?",
      content:
        " Bruddahs, many believed da Ugandan Knuckles tribe was lost to da ages, wiped out by da trials of time. But lo, we found millions of Knuckles warriors—click-click-click!—scattered across da world, still clickin’, still spittin’, still searchin’ for Da Wae! Our sacred mission is to revive da spirit of Ugandan Knuckles, to make da tribe great again! Dis app unites bruddahs globally, tappin’ to honor Da Queen and prove Da Wae lives eternal. Join us, spit on da doubters, and let’s show da world da Knuckles tribe never fades.",
    },
    {
      title: "Who is Ugandan Knuckles?",
      content:
        "Da Ugandan Knuckles are an indigenous Tribe in Uganda. They are part of the echidna family and are mainly found on Lolui Island in Lake Victoria, but there are various communities throughout Uganda.",
    },
    {
      title: "Religion",
      content:
        "The Ugandan Knuckles believe in Da Wae, which is an eternal search for knowledge, meaning, and moral guidance. The deity of this religion is Da Deval. As no written book exists to lay out the tenets of the religion, there are many interpretations of Da Wae passed down through oral tradition. Despite these differences in Da Wae, in the 9000 years since its inception, the Ugandan Knuckles have not experienced any form of sectarian conflict as Da Wae is an individual's unique spiritual journey.",
      content2:
        "Da Wae is quite a complex religion because it includes the sophisticated clicking noises in which are used for finding Da Wae. Ugandan knuckles must be dedicated into finding Da Wae or will be excecuted by the spitting ritual.",
    },
    {
      title: "Language",
      content:
        "The Ugandan Knuckles language mainly consists of clicking sounds which to the untrained ear may sound uniform but is in fact complex and varied dialogue. If they wish to summon a portal they would all chant until the portal is summoned.The clicking noises are a sophisticated way of communicating and is impossible for humans to decode and figure out what they are saying.",
    },
    {
      title: "Politics",
      content:
        "The Ugandan Knuckles are lead by a queen known as 'Da Queen' with a commander serving the same role as a prime minister. The Ugandan Knuckles follow the queen everywhere as according to their customs she knows Da Wae.",
    },
    {
      title: "Join Da Wae!",
      content:
        "Da Wae is a purely spiritual, semi-mystical way of being that only Ugandan Knuckles can truly find. With unstoppable vibes and chaotic charm, it’s being hailed as the next PEPE. Do you know da wae, bruddah?",
    },
  ];

  return (
    <div className="containter-info" onClick={(e)=>{
      e.stopPropagation();
    }}>
      <button className="close-button" onClick={(e)=>{
        e.stopPropagation();
        onClose();
      }}>
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          height="20px"
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"></path>
        </svg>
      </button>
     <div className="containter-info-content">
          {CONTENT.map((item) => (
            <div key={item.title}>
              <h2 className="info-title">{item.title}</h2>
              <p className="info-content">{item.content}</p>
              {item.content2 && <p className="info-content-2">{item.content2}</p>}
            </div>
          ))}
     </div>
    </div>
  );
}
