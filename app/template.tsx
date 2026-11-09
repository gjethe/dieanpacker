import { ViewTransition } from "react";

// A template remounts on navigation, so the old and new page get separate snapshots that crossfade in place
// (a shared snapshot slides when the scroll positions differ). The div makes it one snapshot per page, not one per section.
export default function Template({ children }: LayoutProps<"/">) {
  return <ViewTransition update="none"><div>{children}</div></ViewTransition>;
}
