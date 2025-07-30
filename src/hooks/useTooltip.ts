import { useState } from "react";
import { WarriorData } from "../constants/warriors";

export interface TooltipData extends WarriorData {
    x: number;
    y: number;
    visible: boolean;
}

export const useTooltip = () => {
    const [tooltipData, setTooltipData] = useState<TooltipData>({
        title: "",
        level: "",
        count: 0,
        location: "",
        latitude: 0,
        longitude: 0,
        x: 0,
        y: 0,
        visible: false,
    });

    const showTooltip = (data: WarriorData, x: number, y: number) => {
        setTooltipData({
            ...data,
            x,
            y,
            visible: true,
        });
    };

    const hideTooltip = () => {
        setTooltipData(prev => ({ ...prev, visible: false }));
    };

    return {
        tooltipData,
        showTooltip,
        hideTooltip,
        setTooltipData
    };
}; 