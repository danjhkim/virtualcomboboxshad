import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

type Option = {
	[key: string]: any;
};

interface VirtualizedCommandProps {
	height: string;
	options: Option[];
	placeholder: string;
	selectedOptionId: string | null;
	displayProp: string;
	idProp: string;
	onSelectOption?: (option: Option) => void;
}

const VirtualizedCommand = ({
	height,
	options,
	placeholder,
	selectedOptionId,
	displayProp,
	idProp,
	onSelectOption,
}: VirtualizedCommandProps) => {
	const [filteredOptions, setFilteredOptions] =
		React.useState<Option[]>(options);
	const parentRef = React.useRef(null);

	const virtualizer = useVirtualizer({
		count: filteredOptions.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 35,
		overscan: 5,
	});

	const virtualOptions = virtualizer.getVirtualItems();

	const handleSearch = (search: string) => {
		setFilteredOptions(
			options.filter(option =>
				option[displayProp]
					.toLowerCase()
					.includes(search.toLowerCase()),
			),
		);
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
		}
	};

	return (
		<Command shouldFilter={false} onKeyDown={handleKeyDown}>
			<CommandInput
				onValueChange={handleSearch}
				placeholder={placeholder}
			/>
			<CommandEmpty>No item found.</CommandEmpty>
			<CommandGroup
				ref={parentRef}
				style={{
					height: height,
					width: '100%',
					overflow: 'auto',
				}}>
				<div
					style={{
						height: `${virtualizer.getTotalSize()}px`,
						width: '100%',
						position: 'relative',
					}}>
					{virtualOptions.map(virtualOption => (
						<CommandItem
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: `${virtualOption.size}px`,
								transform: `translateY(${virtualOption.start}px)`,
							}}
							key={filteredOptions[virtualOption.index][idProp]}
							onSelect={() =>
								onSelectOption?.(
									filteredOptions[virtualOption.index],
								)
							}>
							<Check
								className={cn(
									'mr-2 h-4 w-4',
									selectedOptionId ===
										filteredOptions[virtualOption.index][
											idProp
										]
										? 'opacity-100'
										: 'opacity-0',
								)}
							/>
							{filteredOptions[virtualOption.index][displayProp]}
						</CommandItem>
					))}
				</div>
			</CommandGroup>
		</Command>
	);
};

interface VirtualizedComboboxProps {
	options: Option[];
	searchPlaceholder?: string;
	width?: string;
	height?: string;
	displayProp: string;
	idProp: string;
	onSelectionChange: (selected: Option | null) => void;
}

export function VirtualizedCombobox({
	options,
	searchPlaceholder = 'Search items...',
	width = '400px',
	height = '400px',
	displayProp,
	idProp,
	onSelectionChange,
}: VirtualizedComboboxProps) {
	const [open, setOpen] = React.useState<boolean>(false);
	const [selectedOption, setSelectedOption] = React.useState<Option | null>(
		null,
	);

	const handleSelectOption = (option: Option) => {
		setSelectedOption(option === selectedOption ? null : option);
		onSelectionChange(option === selectedOption ? null : option);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='justify-between'
					style={{
						width: width,
					}}>
					{selectedOption
						? selectedOption[displayProp]
						: searchPlaceholder}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='p-0' style={{ width: width }}>
				<VirtualizedCommand
					height={height}
					options={options}
					placeholder={searchPlaceholder}
					selectedOptionId={
						selectedOption ? selectedOption[idProp] : null
					}
					displayProp={displayProp}
					idProp={idProp}
					onSelectOption={handleSelectOption}
				/>
			</PopoverContent>
		</Popover>
	);
}
