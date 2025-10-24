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
  if (task.category === 3 || task.category === 6 || task.category === 7) {
    return ["Bid Now", "Bid"];
  }
  if (task.category === 2) {
    return ["Deposit", "Deposited"];
  }
  if (task.category === 1) {
    return ["Invite", "Invited"];
  }
  if (task.title === "Follow Twitter") {
    return ["Follow", "Followed"];
  }
  if (task.title === "Like a Tweet") {
    return ["Like", "Liked"];
  }
  if (task.title === "Like & RT a Tweet") {
    return ["Like & RT", "Liked"];
  }
  if (task.title === "Join Telegram") {
    return ["Join", "Joined"];
  }
  if (task.title === "Subscribe to TG Channel") {
    return ["Subscribe", "Subscribed"];
  }
  return ["", ""];
};
