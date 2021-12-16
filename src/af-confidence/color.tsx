import { Location } from "molstar/lib/mol-model/location";
import { StructureElement } from "molstar/lib/mol-model/structure";
import { LocationColor } from "molstar/lib/mol-theme/color";
// import { ColorTheme, LocationColor } from "molstar/lib/mol-theme/color";
import { Color } from "molstar/lib/mol-util/color";
// import { TableLegend } from 'molstar/lib/mol-util/legend';
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { CustomProperty } from "molstar/lib/mol-model-props/common/custom-property";
import {
    AfConfidenceProvider,
    getCategories,
    getConfidenceScore,
    isApplicable,
} from "./prop";

import { ColorType } from "molstar/lib/mol-geo/geometry/color-data";
import { CarbohydrateSymbolColorThemeProvider } from "molstar/lib/mol-theme/color/carbohydrate-symbol";
import { UniformColorThemeProvider } from "molstar/lib/mol-theme/color/uniform";
import { deepEqual } from "molstar/lib/mol-util";
import {
    ThemeDataContext,
    ThemeRegistry,
    ThemeProvider,
} from "molstar/lib/mol-theme/theme";
import { ChainIdColorThemeProvider } from "molstar/lib/mol-theme/color/chain-id";
import { ElementIndexColorThemeProvider } from "molstar/lib/mol-theme/color/element-index";
import { ElementSymbolColorThemeProvider } from "molstar/lib/mol-theme/color/element-symbol";
import { MoleculeTypeColorThemeProvider } from "molstar/lib/mol-theme/color/molecule-type";
import { PolymerIdColorThemeProvider } from "molstar/lib/mol-theme/color/polymer-id";
import { PolymerIndexColorThemeProvider } from "molstar/lib/mol-theme/color/polymer-index";
import { ResidueNameColorThemeProvider } from "molstar/lib/mol-theme/color/residue-name";
import { SecondaryStructureColorThemeProvider } from "molstar/lib/mol-theme/color/secondary-structure";
import { SequenceIdColorThemeProvider } from "molstar/lib/mol-theme/color/sequence-id";
import { ShapeGroupColorThemeProvider } from "molstar/lib/mol-theme/color/shape-group";
import { UnitIndexColorThemeProvider } from "molstar/lib/mol-theme/color/unit-index";
import { ScaleLegend, TableLegend } from "molstar/lib/mol-util/legend";
import { UncertaintyColorThemeProvider } from "molstar/lib/mol-theme/color/uncertainty";
import { EntitySourceColorThemeProvider } from "molstar/lib/mol-theme/color/entity-source";
import { IllustrativeColorThemeProvider } from "molstar/lib/mol-theme/color/illustrative";
import { HydrophobicityColorThemeProvider } from "molstar/lib/mol-theme/color/hydrophobicity";
import { ModelIndexColorThemeProvider } from "molstar/lib/mol-theme/color/model-index";
import { OccupancyColorThemeProvider } from "molstar/lib/mol-theme/color/occupancy";
import { OperatorNameColorThemeProvider } from "molstar/lib/mol-theme/color/operator-name";
import { OperatorHklColorThemeProvider } from "molstar/lib/mol-theme/color/operator-hkl";
import { PartialChargeColorThemeProvider } from "molstar/lib/mol-theme/color/partial-charge";
import { AtomIdColorThemeProvider } from "molstar/lib/mol-theme/color/atom-id";
import { EntityIdColorThemeProvider } from "molstar/lib/mol-theme/color/entity-id";
import { TextureFilter } from "molstar/lib/mol-gl/webgl/texture";

interface ColorTheme<P extends PD.Params> {
    readonly factory: ColorTheme.Factory<P>;
    readonly granularity: ColorType;
    readonly color: LocationColor;
    readonly props: Readonly<PD.Values<P>>;
    /**
     * if palette is defined, 24bit RGB color value normalized to interval [0, 1]
     * is used as index to the colors
     */
    readonly palette?: Readonly<ColorTheme.Palette>;
    readonly preferSmoothing?: boolean;
    readonly contextHash?: number;
    readonly description?: string;
    readonly legend?: Readonly<ScaleLegend | TableLegend>;
}
namespace ColorTheme {
    export const enum Category {
        Atom = "Atom Property",
        Chain = "Chain Property",
        Residue = "Residue Property",
        Symmetry = "Symmetry",
        Validation = "Validation",
        Misc = "Miscellaneous",
    }

    export interface Palette {
        filter?: TextureFilter;
        colors: Color[];
    }

    export const PaletteScale = (1 << 24) - 1;

    export type Props = { [k: string]: any };
    export type Factory<P extends PD.Params> = (
        ctx: ThemeDataContext,
        props: PD.Values<P>
    ) => ColorTheme<P>;
    export const EmptyFactory = () => Empty;
    const EmptyColor = Color(0xcccccc);
    export const Empty: ColorTheme<{}> = {
        factory: EmptyFactory,
        granularity: "uniform",
        color: () => EmptyColor,
        props: {},
    };

    export function areEqual(themeA: ColorTheme<any>, themeB: ColorTheme<any>) {
        return (
            themeA.contextHash === themeB.contextHash &&
            themeA.factory === themeB.factory &&
            deepEqual(themeA.props, themeB.props)
        );
    }

    export interface Provider<
        P extends PD.Params = any,
        Id extends string = string
    > extends ThemeProvider<ColorTheme<P>, P, Id> {}
    export const EmptyProvider: Provider<{}> = {
        name: "",
        label: "",
        category: "",
        factory: EmptyFactory,
        getParams: () => ({}),
        defaultValues: {},
        isApplicable: () => true,
    };

    export type Registry = ThemeRegistry<ColorTheme<any>>;
    export function createRegistry() {
        return new ThemeRegistry(
            BuiltIn as { [k: string]: Provider<any> },
            EmptyProvider
        );
    }

    export const BuiltIn = {
        "atom-id": AtomIdColorThemeProvider,
        "carbohydrate-symbol": CarbohydrateSymbolColorThemeProvider,
        "chain-id": ChainIdColorThemeProvider,
        "element-index": ElementIndexColorThemeProvider,
        "element-symbol": ElementSymbolColorThemeProvider,
        "entity-id": EntityIdColorThemeProvider,
        "entity-source": EntitySourceColorThemeProvider,
        hydrophobicity: HydrophobicityColorThemeProvider,
        illustrative: IllustrativeColorThemeProvider,
        "model-index": ModelIndexColorThemeProvider,
        "molecule-type": MoleculeTypeColorThemeProvider,
        occupancy: OccupancyColorThemeProvider,
        "operator-hkl": OperatorHklColorThemeProvider,
        "operator-name": OperatorNameColorThemeProvider,
        "partial-charge": PartialChargeColorThemeProvider,
        "polymer-id": PolymerIdColorThemeProvider,
        "polymer-index": PolymerIndexColorThemeProvider,
        "residue-name": ResidueNameColorThemeProvider,
        "secondary-structure": SecondaryStructureColorThemeProvider,
        "sequence-id": SequenceIdColorThemeProvider,
        "shape-group": ShapeGroupColorThemeProvider,
        uncertainty: UncertaintyColorThemeProvider,
        "unit-index": UnitIndexColorThemeProvider,
        uniform: UniformColorThemeProvider,
    };
    type _BuiltIn = typeof BuiltIn;
    export type BuiltIn = keyof _BuiltIn;
    export type ParamValues<C extends ColorTheme.Provider<any>> =
        C extends ColorTheme.Provider<infer P> ? PD.Values<P> : never;
    export type BuiltInParams<T extends BuiltIn> = Partial<
        ParamValues<_BuiltIn[T]>
    >;
}

const ConfidenceColors: any = {
    "No Score": Color.fromRgb(170, 170, 170), // not applicable
    "Very low": Color.fromRgb(255, 125, 69), // VL
    Low: Color.fromRgb(255, 219, 19), // L
    Medium: Color.fromRgb(101, 203, 243), // M
    High: Color.fromRgb(0, 83, 214), // H
};

export const AfConfidenceColorThemeParams = {
    type: PD.MappedStatic("score", {
        score: PD.Group({}),
        category: PD.Group({
            kind: PD.Text(),
        }),
    }),
};

type Params = typeof AfConfidenceColorThemeParams;

export function AfConfidenceColorTheme(
    ctx: ThemeDataContext,
    props: PD.Values<Params>
): ColorTheme<Params> {
    let color: LocationColor;

    if (
        ctx.structure &&
        !ctx.structure.isEmpty &&
        ctx.structure.models[0].customProperties.has(
            AfConfidenceProvider.descriptor
        )
    ) {
        if (props.type.name === "score") {
            color = (location: Location) => {
                if (StructureElement.Location.is(location)) {
                    const confidenceScore = getConfidenceScore(location);
                    return ConfidenceColors[confidenceScore[1]];
                }
                return ConfidenceColors["No Score"];
            };
        } else {
            const categoryProp = props.type.params.kind;
            color = (location: Location) => {
                if (StructureElement.Location.is(location)) {
                    const confidenceScore = getConfidenceScore(location);
                    if (confidenceScore[1] === categoryProp)
                        return ConfidenceColors[confidenceScore[1]];
                    return ConfidenceColors["No Score"];
                }
                return ConfidenceColors["No Score"];
            };
        }
    } else {
        color = () => ConfidenceColors["No Score"];
    }

    return {
        factory: AfConfidenceColorTheme,
        granularity: "group",
        color,
        props,
        description:
            "Assigns residue colors according to the AF Confidence score",
    };
}

export const AfConfidenceColorThemeProvider: ColorTheme.Provider<
    Params,
    "af-confidence"
> = {
    name: "af-confidence",
    label: "AF Confidence",
    category: ColorTheme.Category.Validation,
    factory: AfConfidenceColorTheme,
    getParams: (ctx) => {
        const categories = getCategories(ctx.structure);
        if (categories.length === 0) {
            return {
                type: PD.MappedStatic("score", {
                    score: PD.Group({}),
                }),
            };
        }

        return {
            type: PD.MappedStatic("score", {
                score: PD.Group({}),
                category: PD.Group(
                    {
                        kind: PD.Select(
                            categories[0],
                            PD.arrayToOptions(categories)
                        ),
                    },
                    { isFlat: true }
                ),
            }),
        };
    },
    defaultValues: PD.getDefaultValues(AfConfidenceColorThemeParams),
    isApplicable: (ctx: ThemeDataContext) =>
        isApplicable(ctx.structure?.models[0]),
    ensureCustomProperties: {
        attach: (ctx: CustomProperty.Context, data: ThemeDataContext) =>
            data.structure
                ? AfConfidenceProvider.attach(
                      ctx,
                      data.structure.models[0],
                      undefined,
                      true
                  )
                : Promise.resolve(),
        detach: (data) =>
            data.structure &&
            data.structure.models[0].customProperties.reference(
                AfConfidenceProvider.descriptor,
                false
            ),
    },
};
