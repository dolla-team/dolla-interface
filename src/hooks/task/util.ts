export const getButtonText = (task: any) => {
  if (task.is_completed && !task.is_claimed) {
    return ["Claim", "Claimed"];
  }
  if (task.category === 5) {
    return ["Create", "Created"];
  }
  if (task.category === 4) {
    return ["Swap", "Swapped"];
  }
  if (task.category === 3) {
    return ["Bid Now", "Bid"];
  }
  if (task.category === 2) {
    return ["Deposit", "Deposited"];
  }
  if (task.category === 1) {
    return ["Invite", "Invited"];
  }
  if (task.id === 1) {
    return ["Follow", "Followed"];
  }
  if (task.id === 2) {
    return ["Like", "Liked"];
  }
  if (task.id === 3) {
    return ["Like & RT", "Liked"];
  }
  if (task.id === 4) {
    return ["Join", "Joined"];
  }
  if (task.id === 5) {
    return ["Subscribe", "Subscribed"];
  }
  return ["", ""];
};
