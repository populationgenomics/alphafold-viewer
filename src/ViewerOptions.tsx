import React from "react";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { Script } from "molstar/lib/mol-script/script";
import { StructureSelection } from "molstar/lib/mol-model/structure";
import { StructureSelectionQuery } from "molstar/lib/mol-plugin-state/helpers/structure-selection-query";
import { setStructureOverpaint } from "molstar/lib/mol-plugin-state/helpers/structure-overpaint";
import { MolScriptBuilder as MS } from "molstar/lib/mol-script/language/builder";
import { Structure } from "molstar/lib/mol-model/structure";
import { Color } from "molstar/lib/mol-util/color";

interface ViewerOptionsProps {
    plugin: React.MutableRefObject<PluginContext | null>;
}

const ViewerOptions: React.FunctionComponent<ViewerOptionsProps> = ({
    plugin,
}) => {
    async function createComponent(
        event: React.SyntheticEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        const form = event.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            start: { value: number };
            end: { value: number };
            // colourPicker: { value: string };
            name: { value: string };
            style: { value: string };
        };
        const range = Array.from(
            { length: formElements.end.value - formElements.start.value },
            (v, k) => k + Number(formElements.start.value)
        );
        const data =
            plugin.current!.managers.structure.hierarchy.current.structures[0]
                ?.cell.obj?.data;
        if (!data) return;

        const currentSelection = StructureSelectionQuery(
            "",
            MS.struct.generator.atomGroups({
                "residue-test": MS.core.set.has([
                    MS.set(...range),
                    MS.ammp("auth_seq_id"),
                ]),
                "group-by": MS.struct.atomProperty.macromolecular.residueKey(),
            })
        );

        await plugin.current!.managers.structure.component.add({
            selection: currentSelection,
            options: { checkExisting: true, label: formElements.name.value },
            representation: formElements.style.value,
        });
    }

    async function colour(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            start: { value: number };
            end: { value: number };
            colourPicker: { value: string };
        };
        const range = Array.from(
            { length: formElements.end.value - formElements.start.value },
            (v, k) => k + Number(formElements.start.value)
        );

        const data =
            plugin.current!.managers.structure.hierarchy.current.structures[0]
                ?.cell.obj?.data;
        if (!data) return;

        const selection = Script.getStructureSelection(
            (Q) =>
                Q.struct.generator.atomGroups({
                    "residue-test": Q.core.set.has([
                        Q.set(...range),
                        Q.ammp("auth_seq_id"),
                    ]),
                    "group-by":
                        Q.struct.atomProperty.macromolecular.residueKey(),
                }),
            data
        );
        const lociGetter = async (s: Structure) =>
            StructureSelection.toLociWithSourceUnits(selection);

        for (const s of plugin.current!.managers.structure.hierarchy.current
            .structures) {
            const components = s.components;
            setStructureOverpaint(
                plugin.current!,
                components,
                Color(
                    Number(`0x${formElements.colourPicker.value.substring(1)}`)
                ),
                lociGetter
            );
        }
    }

    const inputStyle = {
        width: 200,
        // marginBottom: 10,
        padding: 2,
    };

    const labelStyle = {
        display: "block",
        width: 50,
    };

    return (
        <>
            <h5>Create Component</h5>
            <form onSubmit={createComponent}>
                <label style={labelStyle}>
                    Start
                    <input type="number" id="start" style={inputStyle} />
                </label>
                <br />
                <label style={labelStyle}>
                    End
                    <input type="number" id="end" style={inputStyle} />
                </label>
                <br />
                <label style={labelStyle}>
                    Name
                    <input type="text" id="name" style={inputStyle} />
                </label>
                <br />
                <label style={labelStyle}>
                    Style
                    <select id="style" style={inputStyle}>
                        <option value="cartoon">Cartoon</option>
                        <option value="backbone">Backbone</option>
                        <option value="ball-and-stick">Ball And Stick</option>
                        <option value="carbohydrate">Carbohydrate</option>
                        <option value="ellipsoid">Ellipsoid</option>
                        <option value="gaussian-surface">
                            Gaussian Surface
                        </option>
                        <option value="guassian-volume">Gaussian Volume</option>
                        <option value="label">Label</option>
                        <option value="line">Line</option>
                        <option value="molecular-surface">
                            Molecular Surface
                        </option>
                        <option value="orientation">Orientation</option>
                        <option value="point">Point</option>
                        <option value="putty">Putty</option>
                        <option value="spacefill">Spacefill</option>
                    </select>
                </label>
                <br />
                <button
                    type="submit"
                    id="createComponent"
                    style={{ height: 30 }}
                >
                    Create Component
                </button>
            </form>
            <br />
            <h5>Set Colouring</h5>
            <form onSubmit={colour}>
                <label style={labelStyle}>
                    Start
                    <input type="number" id="start" style={inputStyle} />
                </label>
                <br />
                <label style={labelStyle}>
                    End
                    <input type="number" id="end" style={inputStyle} />
                </label>
                <br />

                <label style={labelStyle}>
                    Colour
                    <input type="color" id="colourPicker" style={inputStyle} />
                </label>

                <br />
                <br />
                <button
                    type="submit"
                    id="colour"
                    style={{ height: 30, marginRight: 10 }}
                >
                    Set Colour
                </button>
            </form>
        </>
    );
};

export default ViewerOptions;
