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

const STYLE_OPTIONS = {
    // from https://github.com/molstar/molstar/blob/1a8dc2c637c3291986c592ab5a5e911a4e42fd32/src/mol-repr/structure/registry.ts#L38
    cartoon: "Cartoon",
    backbone: "Backbone",
    "ball-and-stick": "Ball And Stick",
    carbohydrate: "Carbohydrate",
    ellipsoid: "Ellipsoid",
    "gaussian-surface": "Gaussian Surface",
    "guassian-volume": "Gaussian Volume",
    label: "Label",
    line: "Line",
    "molecular-surface": "Molecular Surface",
    orientation: "Orientation",
    point: "Point",
    putty: "Putty",
    spacefill: "Spacefill",
};

const ViewerOptions: React.FunctionComponent<ViewerOptionsProps> = ({
    plugin,
}) => {
    async function createComponent(
        event: React.SyntheticEvent<HTMLFormElement>
    ) {
        try {
            event.preventDefault();
            const form = event.currentTarget;
            const formElements = form.elements as typeof form.elements & {
                start: { value: string };
                end: { value: string };
                name: { value: string };
                style: { value: string };
            };
            const start = parseInt(formElements.start.value);
            const end = parseInt(formElements.end.value);
            const range = Array.from(
                { length: end - start },
                (_, idx) => idx + start
            );

            const currentSelection = StructureSelectionQuery(
                "",
                MS.struct.generator.atomGroups({
                    "residue-test": MS.core.set.has([
                        MS.set(...range),
                        MS.ammp("auth_seq_id"),
                    ]),
                    "group-by":
                        MS.struct.atomProperty.macromolecular.residueKey(),
                })
            );

            await plugin.current!.managers?.structure?.component?.add({
                selection: currentSelection,
                options: {
                    checkExisting: true,
                    label: formElements.name.value,
                },
                representation: formElements.style.value,
            });
        } catch (error) {
            console.log(error);
            alert("An error occurred when creating a new component");
            return;
        }
    }

    async function colour(event: React.SyntheticEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            const form = event.currentTarget;
            const formElements = form.elements as typeof form.elements & {
                start: { value: string };
                end: { value: string };
                colourPicker: { value: string };
            };
            const start = parseInt(formElements.start.value);
            const end = parseInt(formElements.end.value);
            const range = Array.from(
                //creates an array of all numbers in [start, end]
                { length: end - start },
                (_, idx) => idx + start
            );

            const data =
                plugin.current!.managers.structure.hierarchy.current
                    .structures[0]?.cell.obj?.data;
            if (!data) {
                alert("Problem with data, try to reload viewer.");
                return;
            }

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

            const components =
                plugin.current!.managers.structure.hierarchy.current
                    .structures[0].components;

            setStructureOverpaint(
                plugin.current!,
                components,
                Color(
                    Number(`0x${formElements.colourPicker.value.substring(1)}`)
                ),
                lociGetter
            );
        } catch (error) {
            console.log(error);
            alert("An error occurred");
            return;
        }
    }

    const inputStyle: React.CSSProperties = {
        width: 200,
        // marginBottom: 10,
        padding: 2,
    };

    const labelStyle: React.CSSProperties = {
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
                        {Object.entries(STYLE_OPTIONS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
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
