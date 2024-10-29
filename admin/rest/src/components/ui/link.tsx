import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
import cn from 'classnames';

const Link: React.FC<
  NextLinkProps & {
    className?: string;
    title?: string;
    children?: React.ReactNode;
  }
> = ({ className, children, ...props }) => {
  const router = useRouter();

  return (
    <NextLink
      {...props}
      className={cn(className, {
        'text-accent': router.asPath === props.href,
        'text-body-dark': router.asPath !== props.href,
      })}
    >
      {children}
    </NextLink>
  );
};

export default Link;
