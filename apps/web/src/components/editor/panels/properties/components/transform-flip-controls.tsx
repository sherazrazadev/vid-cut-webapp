"use client";

import { invokeAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { OcMirrorIcon } from "@/components/icons";
import {
	Section,
	SectionContent,
	SectionField,
	SectionFields,
} from "@/components/section";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function TransformFlipControls({
	elementId,
}: {
	elementId: string;
}) {
	return (
		<Section sectionKey={`${elementId}:flip`}>
			<SectionContent className="pt-2">
				<SectionFields>
					<SectionField label="Flip">
						<div className="flex items-center gap-1.5">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="secondary"
										size="sm"
										onClick={() => invokeAction("flip-horizontal-selected")}
									>
										<OcMirrorIcon className="size-3.5" />
										<span className="ml-1.5">Horizontal</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>Flip horizontally</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="secondary"
										size="sm"
										onClick={() => invokeAction("flip-vertical-selected")}
									>
										<OcMirrorIcon className="size-3.5 rotate-90" />
										<span className="ml-1.5">Vertical</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>Flip vertically</TooltipContent>
							</Tooltip>
						</div>
					</SectionField>
				</SectionFields>
			</SectionContent>
		</Section>
	);
}
