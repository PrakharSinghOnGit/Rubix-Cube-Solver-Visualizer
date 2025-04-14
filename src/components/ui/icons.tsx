export const Cross = ({ hex }: { hex: string }) => {
  return (
    <svg
      className="hover:fill-red-400 cursor-pointer"
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={hex}
    >
      <path d="m256-168-88-88 224-224-224-224 88-88 224 224 224-224 88 88-224 224 224 224-88 88-224-224-224 224Z" />
    </svg>
  );
};

export const CollapseAll = ({ hex }: { hex: string }) => {
  return (
    <svg
      className="hover:fill-blue-400 cursor-pointer"
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={hex}
    >
      <path d="m296-48-88-88 272-272 272 272-88 88-184-184L296-48Zm184-504L208-824l88-88 184 184 184-184 88 88-272 272Z" />
    </svg>
  );
};

export const ExpandAll = ({ hex }: { hex: string }) => {
  return (
    <svg
      className="hover:fill-blue-300 cursor-pointer"
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={hex}
    >
      <path d="M480-48 208-320l88-88 184 183 184-183 88 88L480-48ZM296-552l-88-88 272-272 272 272-88 88-184-183-184 183Z" />
    </svg>
  );
};

export const Redo = ({ hex }: { hex: string }) => {
  return (
    <svg
      className="cursor-pointer hover:fill-blue-300"
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={hex}
    >
      <path d="M292-166v-126h293q51 0 87-35.5t36-86.5q0-51-36-87t-87-36H366l83 83-88 88-235-234 235-234 88 88-83 83h219q103 0 176 72.5T834-415q0 103-73 176t-176 73H292Z" />
    </svg>
  );
};

export const DoubleRightArrow = ({ hex }: { hex: string }) => {
  return (
    <svg
      className="cursor-pointer hover:fill-yellow-300"
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill={hex}
    >
      <g>
        <rect fill="none" height="24" width="24" />
      </g>
      <g>
        <g>
          <polygon points="15.5,5 11,5 16,12 11,19 15.5,19 20.5,12" />
          <polygon points="8.5,5 4,5 9,12 4,19 8.5,19 13.5,12" />
        </g>
      </g>
    </svg>
  );
};

export const Expand = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#fff"
    >
      <path d="M24 24H0V0h24v24z" fill="none" opacity=".87" />
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" />
    </svg>
  );
};

export const Collapse = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#e3e3e3"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z" />
    </svg>
  );
};
