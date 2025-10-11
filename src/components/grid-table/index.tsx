import clsx from "clsx";
import React, { useImperativeHandle, useMemo } from "react";
import Loading from "@/components/icons/loading";
import Empty from "@/sections/wallet/panels/info/empty";

const GridTable = (props: Props, ref: any) => {
  const {
    data = [],
    columns,
    className,
    headerClassName,
    bodyClassName,
    rowClassName,
    headerRowClassName,
    bodyRowClassName,
    colClassName,
    headerColClassName,
    bodyColClassName,
    emptyClassName,
    sortDataIndex,
    sortDirection,
    onSort,
    loading
  } = props;

  const [gridTemplateColumns] = useMemo(() => {
    return [
      columns
        .map((col: any) => {
          return col.width
            ? typeof col.width === "number"
              ? `${col.width}px`
              : col.width
            : "auto";
        })
        .join(" ")
    ];
  }, [columns]);

  const renderColStyles = (col: any, isBody?: boolean) => {
    const ellipsis: any = {};
    if (col.ellipsis) {
      ellipsis.overflow = "hidden";
      ellipsis.textOverflow = "ellipsis";
      ellipsis.whiteSpace = "nowrap";
    }
    return {
      textAlign: col.align || "left",
      justifyContent:
        col.align === "center"
          ? "center"
          : col.align === "right"
          ? "flex-end"
          : "flex-start",
      cursor: col.sort && !isBody ? "pointer" : "default",
      ...ellipsis
    };
  };

  const refs = {};
  useImperativeHandle(ref, () => refs);

  return (
    <div
      className={clsx(
        "w-full text-[#2B3337] text-[12px] font-normal leading-[16px]",
        className
      )}
    >
      <div
        className={clsx(
          "border-b border-[#E4E4E4] max-md:min-w-fit",
          headerClassName
        )}
      >
        <div
          className={clsx(
            "grid gap-x-[10px] px-[5px]",
            rowClassName,
            headerRowClassName
          )}
          style={{
            gridTemplateColumns
          }}
        >
          {columns.map((col: any, index: number) => (
            <div
              key={`grid-table-header-col-${index}`}
              className={clsx(
                "flex items-center text-[12px] py-[10px]",
                col.align === "center"
                  ? "justify-center"
                  : col.align === "right"
                  ? "justify-end"
                  : "justify-start",
                col.sort && !loading ? "cursor-pointer" : "cursor-default",
                col.fixed ? "sticky left-0" : "",
                colClassName,
                headerColClassName
              )}
              style={renderColStyles(col)}
              onClick={() => {
                if (col.sort && !loading) {
                  let nextDirection =
                    sortDirection === GridTableSortDirection.Asc
                      ? GridTableSortDirection.Desc
                      : GridTableSortDirection.Asc;
                  if (sortDataIndex !== col.dataIndex) {
                    nextDirection = GridTableSortDirection.Asc;
                  }
                  onSort?.(col.dataIndex, nextDirection);
                }
              }}
            >
              {typeof col.title === "function" ? (
                col.title(col, index)
              ) : (
                <div
                  className={clsx(
                    "inline-block",
                    col.ellipsis &&
                      "overflow-hidden text-ellipsis whitespace-nowrap"
                  )}
                  title={
                    col.ellipsis && typeof col.title === "string" && col.title
                  }
                >
                  {col.title}
                </div>
              )}
              {col.sort && (
                <div className="flex-shrink-0 w-[7px] h-[10px] ml-[6px]">
                  <svg
                    width="7"
                    height="10"
                    viewBox="0 0 7 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.5 0L6.53109 3H0.468911L3.5 0Z"
                      fill={
                        sortDirection === GridTableSortDirection.Asc &&
                        sortDataIndex === col.dataIndex
                          ? "#FBCA04"
                          : "white"
                      }
                      fillOpacity={
                        sortDirection === GridTableSortDirection.Asc &&
                        sortDataIndex === col.dataIndex
                          ? 1
                          : 0.4
                      }
                    />
                    <path
                      d="M3.5 10L6.53109 7H0.468911L3.5 10Z"
                      fill={
                        sortDirection === GridTableSortDirection.Desc &&
                        sortDataIndex === col.dataIndex
                          ? "#FBCA04"
                          : "white"
                      }
                      fillOpacity={
                        sortDirection === GridTableSortDirection.Desc &&
                        sortDataIndex === col.dataIndex
                          ? 1
                          : 0.4
                      }
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div
        className={clsx(
          "border-b border-[#E4E4E4] max-md:min-w-fit",
          bodyClassName
        )}
      >
        {loading ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <Loading />
          </div>
        ) : data?.length > 0 ? (
          data.map((item: any, index: number) => (
            <div
              key={`grid-table-body-row-${index}`}
              className={clsx(
                "grid gap-x-[10px] px-[5px]",
                rowClassName,
                bodyRowClassName
              )}
              style={{
                gridTemplateColumns
              }}
            >
              {columns.map((col: any, idx: number) => (
                <div
                  key={`grid-table-body-col-${idx}`}
                  className={clsx(
                    "flex items-center py-[17px]",
                    col.align === "center"
                      ? "justify-center"
                      : col.align === "right"
                      ? "justify-end"
                      : "justify-start",
                    col.fixed ? "sticky left-0" : "",
                    colClassName,
                    bodyColClassName
                  )}
                  style={renderColStyles(col, true)}
                >
                  {typeof col.render === "function" ? (
                    <div
                      className={clsx(
                        "inline-block max-w-full",
                        col.ellipsis &&
                          "overflow-hidden text-ellipsis whitespace-nowrap"
                      )}
                    >
                      {col.render(item, index, col, idx)}
                    </div>
                  ) : (
                    <div
                      className={clsx(
                        "inline-block max-w-full",
                        col.ellipsis &&
                          "overflow-hidden text-ellipsis whitespace-nowrap"
                      )}
                      title={col.ellipsis && item[col.dataIndex]}
                    >
                      {item[col.dataIndex]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div
            className={clsx(
              "flex justify-center items-center min-h-[200px]",
              emptyClassName
            )}
          >
            <Empty text="No Data" />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.forwardRef<any, Props>(GridTable);

export interface Props {
  data?: Record<string, any>[];
  columns: {
    dataIndex: string;
    title: string | ((col: any, index: number) => any);
    align?: GridTableAlign;
    sort?: boolean;
    render?: (item: any, index: number, col: any, idx: number) => any;
    ellipsis?: boolean;
    width?: string | number;
  }[];
  loading?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  headerRowClassName?: string;
  bodyRowClassName?: string;
  colClassName?: string;
  headerColClassName?: string;
  bodyColClassName?: string;
  emptyClassName?: string;
  sortDataIndex?: string;
  sortDirection?: GridTableSortDirection;
  onSort?: (dataIndex: string, direction: GridTableSortDirection) => void;
}

export enum GridTableAlign {
  Left = "left",
  Center = "center",
  Right = "right"
}

export enum GridTableSortDirection {
  Asc = "asc",
  Desc = "desc"
}
