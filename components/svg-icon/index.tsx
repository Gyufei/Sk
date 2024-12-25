import * as Icons from './iconsType'

type SvgIconProps = {
  name: string;
  size: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const isIconKey = (key: string): key is keyof typeof Icons => {
  return key in Icons;
};

const SvgIcon = ({ name, size= 30, ...props }: SvgIconProps) => {
  if (isIconKey(name)) {
    const IconComponent = Icons[name];
    return (
      <IconComponent 
        {...props} 
        width={size} 
        height={size} 
        className={`svgIcon-${size}`}
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
      />
    )
  } else {
    throw new Error(`SVG icon with name ${name} not found`);
  }
};

export default SvgIcon;
