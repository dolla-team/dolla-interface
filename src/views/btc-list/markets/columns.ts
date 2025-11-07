export const liveColumns = [
  {
    title: "#",
    dataIndex: "pool_id",
    width: "5%",
    sort: true
  },
  {
    title: "Markets",
    dataIndex: "market",
    width: "25%"
  },
  {
    title: "Live",
    dataIndex: "live",
    width: "10%"
  },
  {
    title: "Value",
    dataIndex: "anchor_price",
    width: "15%",
    sort: true
  },
  {
    title: "Total Bids",
    dataIndex: "accumulative_bids",
    width: "15%",
    sort: true
  },
  {
    title: "Fill level",
    dataIndex: "hitting",
    width: "20%",
    sort: true
  },
  {
    title: "#Bidders",
    dataIndex: "participants",
    width: "10%",
    sort: true,
    align: "right"
  }
];

export const soldColumns = [
  {
    title: "#",
    dataIndex: "pool_id",
    width: "5%",
    sort: true
  },
  {
    title: "Markets",
    dataIndex: "market",
    width: "25%"
  },
  {
    title: "Value",
    dataIndex: "anchor_price",
    width: "15%",
    sort: true
  },
  {
    title: "Total Bids",
    dataIndex: "accumulative_bids",
    width: "10%",
    sort: true
  },
  {
    title: "#Bidders",
    dataIndex: "participants",
    width: "10%",
    sort: true
  },
  {
    title: "Fill level",
    dataIndex: "hitting",
    width: "20%",
    sort: true
  },
  {
    title: "Status",
    dataIndex: "status",
    width: "15%",
    align: "center"
  }
];
