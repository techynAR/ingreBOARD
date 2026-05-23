'use client';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { Github } from 'lucide-react';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);
	const location = useLocation();

	const links = [
		{
			label: 'Home',
			to: '/',
		},
		{
			label: 'About',
			to: '/about',
		},
		{
			label: 'Technology',
			to: '/technology',
		},
		{
			label: 'Image Scan',
			to: '/scanner',
		},
		{
			label: 'Barcode Scan',
			to: '/barcode-scanner',
		},
	];

	React.useEffect(() => {
		if (open) {
			// Disable scroll
			document.body.style.overflow = 'hidden';
		} else {
			// Re-enable scroll
			document.body.style.overflow = '';
		}

		// Cleanup when component unmounts (important for Next.js)
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn(
				'sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
				{
					'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow':
						scrolled && !open,
					'bg-background/90': open,
				},
			)}
		>
			<nav
				className={cn(
					'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
					{
						'md:px-2': scrolled,
					},
				)}
			>
				<Link to="/" className="flex items-center">
					<img
						src="/ingreBOARD-logo.png"
						alt="ingreBOARD Logo"
						className="h-8 w-8 rounded-full object-cover"
					/>
				</Link>
				<div className="hidden items-center gap-2 md:flex">
					{links.map((link, i) => (
						<Link
							key={i}
							className={cn(
								buttonVariants({ variant: 'ghost' }),
								location.pathname === link.to && 'text-emerald-400'
							)}
							to={link.to}
						>
							{link.label}
						</Link>
					))}
				</div>
				<div className="flex items-center gap-2">
					<a
						href="https://github.com/techynAR/ingreBOARD"
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							buttonVariants({ variant: 'outline' }),
							'hidden md:flex items-center gap-1.5 text-sm font-medium border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-400 transition-all'
						)}
					>
						<Github className="h-4 w-4" />
						<span>Contribute</span>
					</a>
					<Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="md:hidden">
						<MenuToggleIcon open={open} className="size-5" duration={300} />
					</Button>
				</div>
			</nav>

			<div
				className={cn(
					'bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
					open ? 'block' : 'hidden',
				)}
			>
				<div
					data-slot={open ? 'open' : 'closed'}
					className={cn(
						'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
						'flex h-full w-full flex-col justify-between gap-y-2 p-4',
					)}
				>
					<div className="grid gap-y-2">
						{links.map((link) => (
							<Link
								key={link.label}
								className={cn(
									buttonVariants({
										variant: 'ghost',
										className: 'justify-start',
									}),
									location.pathname === link.to && 'text-emerald-400'
								)}
								to={link.to}
								onClick={() => setOpen(false)}
							>
								{link.label}
							</Link>
						))}
					</div>
					<div className="flex flex-col gap-2">
						<a
							href="https://github.com/techynAR/ingreBOARD"
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								buttonVariants({ variant: 'outline', className: 'justify-start' }),
								'flex items-center gap-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
							)}
							onClick={() => setOpen(false)}
						>
							<Github className="h-4 w-4" />
							Contribute on GitHub
						</a>
					</div>
				</div>
			</div>
		</header>
	);
}
