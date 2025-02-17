import { IPlayer } from "../../PersonObjects/IPlayer";
import { Milestones } from "../Milestones";
import { Milestone } from "../Milestone";
import * as React from "react";

interface IProps {
  player: IPlayer;
}

function highestMilestone(p: IPlayer, milestones: Milestone[]): number {
  let n = -1;
  for (let i = 0; i < milestones.length; i++) {
    if (milestones[i].fulfilled(p)) n = i;
  }

  return n;
}

export function Root(props: IProps): JSX.Element {
  const n = highestMilestone(props.player, Milestones);
  const milestones = Milestones.map((milestone: Milestone, i: number) => {
    if (i <= n + 1) {
      return (
        <ul key={i}>
          <p>
            [{milestone.fulfilled(props.player) ? "x" : " "}] {milestone.title}
          </p>
        </ul>
      );
    }
  });
  return (
    <>
      <h1>Milestones</h1>
      <p>
        Milestones don't reward you for completing them. They are here to guide
        you if you're lost. They will reset when you install Augmentations.
      </p>
      <br />

      <h2>Completing fl1ght.exe</h2>
      <li>{milestones}</li>
    </>
  );
}
