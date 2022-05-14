import React from "react";
import { Block, Value, Field, Shadow } from "./Blockly";

export function ToolboxBlocks() {
  return (
    <>
      <Block type="group">
        <Value name="ITEM0">
          <Shadow type="element_literal">
            <Field name="VALUE">3</Field>
          </Shadow>
        </Value>
      </Block>
      <Block type="move">
        <Value name="DIRECTION">
          <Shadow type="vector_constant">
            <Field name="VALUE">DOWN</Field>
          </Shadow>
        </Value>
      </Block>
      <Block type="change_into">
        <Value name="CELL">
          <Shadow type="vector_constant">
            <Field name="VALUE">HERE</Field>
          </Shadow>
        </Value>
        <Value name="ELEMENT">
          <Shadow type="element_literal">
            <Field name="VALUE">3</Field>
          </Shadow>
        </Value>
      </Block>
      <Block type="is_block">
        <Value name="CELL">
          <Shadow type="vector_constant">
            <Field name="VALUE">DOWN</Field>
          </Shadow>
        </Value>
        <Value name="ELEMENT">
          <Shadow type="element_literal">
            <Field name="VALUE">0</Field>
          </Shadow>
        </Value>
      </Block>
      <Block type="is_touching">
        <Value name="ELEMENT">
          <Shadow type="element_literal">
            <Field name="VALUE">2</Field>
          </Shadow>
        </Value>
      </Block>
      <Block type="element_cell">
        <Value name="CELL">
          <Shadow type="vector_constant">
            <Field name="VALUE">DOWN</Field>
          </Shadow>
        </Value>
      </Block>
      <Block type="vector_constant">
        <Field name="VALUE">HERE</Field>
      </Block>
      <Block type="vector_literal">
        <Value name="X">
          <Shadow type="number_literal">
            <Field name="VALUE">0</Field>
          </Shadow>
        </Value>
        <Value name="Y">
          <Shadow type="number_literal">
            <Field name="VALUE">0</Field>
          </Shadow>
        </Value>
      </Block>

      <Block type="in_a_random">
        <Field name="NAME">ROTATION</Field>
      </Block>
      <Block type="rotated_by">
        <Value name="NUMBER">
          <Shadow type="number_literal">
            <Field name="VALUE">0</Field>
          </Shadow>
        </Value>
      </Block>
      {/* <Block type="for_all">
                <Field name="NAME">ROTATION</Field>
              </Block> */}
      <Block type="number_literal">
        <Field name="VALUE">0</Field>
      </Block>
      <Block type="operation">
        <Field name="OPERATION">ADD</Field>
        <Value name="A">
          <Shadow type="number_literal">
            <Field name="VALUE">0</Field>
          </Shadow>
        </Value>
        <Value name="B">
          <Shadow type="number_literal">
            <Field name="VALUE">0</Field>
          </Shadow>
        </Value>
      </Block>
      <Block type="random_number">
        <Value name="MIN">
          <Shadow type="number_literal">
            <Field name="VALUE">-1</Field>
          </Shadow>
        </Value>
        <Value name="MAX">
          <Shadow type="number_literal">
            <Field name="VALUE">1</Field>
          </Shadow>
        </Value>
      </Block>
      <Block type="one_in">
        <Value name="NUMBER">
          <Shadow type="number_literal">
            <Field name="VALUE">2</Field>
          </Shadow>
        </Value>
      </Block>
      {/* <Block type="repeat">
                <Value name="NUMBER">
                  <Shadow type="number_literal">
                    <Field name="VALUE">2</Field>
                  </Shadow>
                </Value>
              </Block> */}
      <Block type="controls_if"></Block>
      {/* <Block type="if"></Block> */}
      <Block type="key_pressed"></Block>
      <Block type="comparison">
        <Field name="COMPARISON">IS</Field>
      </Block>
      <Block type="boolean_operation">
        <Field name="OPERATION">AND</Field>
      </Block>
      <Block type="bool_literal">
        <Field name="VALUE">TRUE</Field>
      </Block>
      <Block type="not"></Block>
      <Block type="get_r_cell_flexible">
        <Field name="DATA">RA</Field>
      </Block>
      <Block type="modify_r_cell_flexible">
        <Field name="DATA">RA</Field>
        <Value name="VALUE">
          <Shadow type="number_literal">
            <Field name="VALUE">0</Field>
          </Shadow>
        </Value>
      </Block>
      <Block type="set_r_cell_flexible">
        <Field name="DATA">RA</Field>
        <Value name="VALUE">
          <Shadow type="number_literal">
            <Field name="VALUE">0</Field>
          </Shadow>
        </Value>
      </Block>
    </>
  );
}
