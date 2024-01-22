import React from 'react';
import Link from 'next/link';
import { cn } from '@aionx/aionx-ui';
import { ChevronRightIcon } from '@radix-ui/react-icons';

interface BreadCrumbType {
  title: string;
  link: string;
}

interface BreadCrumbPropsType {
  items: BreadCrumbType[];
}

export default function BreadCrumb({ items }: BreadCrumbPropsType) {
  return (
    <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        href={'/dashboard'}
        className="overflow-hidden text-ellipsis whitespace-nowrap"
      >
        Dashboard
      </Link>
      {items?.map((item: BreadCrumbType, index: number) => (
        <React.Fragment key={item.title}>
          <ChevronRightIcon className="h-4 w-4" />
          <Link
            href={item.link}
            className={cn(
              'font-medium',
              index === items.length - 1
                ? 'text-foreground pointer-events-none'
                : 'text-muted-foreground'
            )}
          >
            {item.title}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}
