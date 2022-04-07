const a = [
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="44" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="93" y="66">
    <statement name="body">
      <block type="controls_if" id="0MLT7JYus%h4e0-n4-L$">
        <mutation elseif="1"></mutation>
        <value name="IF0">
          <block type="is_block" id="AH%gv!GiF@91}R-*_x$v">
            <value name="CELL">
              <shadow type="vector_constant" id="u^R~Y;TB91f_d4|EBB#}">
                <field name="VALUE">DOWN</field>
              </shadow>
            </value>
            <value name="ELEMENT">
              <shadow type="element_literal" id="7e:{%x3%K./;X8/=AK{l">
                <field name="VALUE">AIR</field>
              </shadow>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="swap" id="sxrv-)=m9lOFLQk|(lC)">
            <value name="A">
              <shadow type="vector_constant" id="[8PN!zm5B8CKO$8hz9oJ">
                <field name="VALUE">HERE</field>
              </shadow>
            </value>
            <value name="B">
              <shadow type="vector_constant" id=";Nvk6U8xUnwu9VW+~]dG">
                <field name="VALUE">DOWN</field>
              </shadow>
            </value>
          </block>
        </statement>
        <value name="IF1">
          <block type="bool_literal" id="A+90u~!QWk-OsT[.MZUf">
            <field name="VALUE">TRUE</field>
          </block>
        </value>
        <statement name="DO1">
          <block type="in_a_random" id="wtFcA$#7C~ot8U$^QEBy">
            <field name="NAME">HORIZONTAL_REFLECTION</field>
            <statement name="NAME">
              <block type="if" id="+5|]muZvW#)c~})gAU6w">
                <value name="CONDITION">
                  <block type="is_block" id="E98p,^=2+U^#zEy-l7?:">
                    <value name="CELL">
                      <shadow type="vector_constant" id=":$$BXo=(a]f*-ksBI-4P">
                        <field name="VALUE">RIGHT</field>
                      </shadow>
                    </value>
                    <value name="ELEMENT">
                      <shadow type="element_literal" id="XzQE)QD/z8NjK:,=BWq-">
                        <field name="VALUE">AIR</field>
                      </shadow>
                    </value>
                  </block>
                </value>
                <statement name="THEN">
                  <block type="swap" id="Yeo:PjM=)Qf6j2wNvg]w">
                    <value name="A">
                      <shadow type="vector_constant" id=".,6M,*2yH@eg--ICd;v2">
                        <field name="VALUE">HERE</field>
                      </shadow>
                    </value>
                    <value name="B">
                      <shadow type="vector_constant" id="uf@n#yse--k43]62OoH}">
                        <field name="VALUE">RIGHT</field>
                      </shadow>
                    </value>
                  </block>
                </statement>
              </block>
            </statement>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="0" y="84">
    <statement name="body">
      <block type="if" id="Fz:HaO:7rr37x,QV2(F8">
        <value name="CONDITION">
          <block type="is_block" id="Bj7aQ|lWH*_*aSE|PFkB">
            <value name="CELL">
              <shadow type="vector_constant" id="MSZ[QB},w79,pBz5fHuB">
                <field name="VALUE">DOWN</field>
              </shadow>
            </value>
            <value name="ELEMENT">
              <shadow type="element_literal" id="-0X#Q+WjcS;nRoO=)~4d">
                <field name="VALUE">AIR</field>
              </shadow>
              <block type="group" id="TBk/FB9]}7qRHkm$Z{PN">
                <mutation itemCount="2"></mutation>
                <value name="ITEM0">
                  <shadow type="element_literal" id="}QX6ItQN]Y2V+LO^_[sD">
                    <field name="VALUE">AIR</field>
                  </shadow>
                </value>
                <value name="ITEM1">
                  <shadow type="element_literal" id="U6nM/P]j;9B{KrKgT[1Q">
                    <field name="VALUE">WATER</field>
                  </shadow>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="THEN">
          <block type="swap" id="WZ|mbuH:c-^Qgy=^u)=|">
            <value name="A">
              <shadow type="vector_constant" id="K2SWG%h+f4S2G-t=HBSd">
                <field name="VALUE">HERE</field>
              </shadow>
            </value>
            <value name="B">
              <shadow type="vector_constant" id="6-n-_@-L#7L!|m}+T?;-">
                <field name="VALUE">DOWN</field>
              </shadow>
            </value>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="0" y="96"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="44" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="50" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="44" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="50" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="44" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="50" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="44" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="50" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="50" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="50" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="50" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="50" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="50" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="50" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" x="50" y="10"></block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" movable="true" x="50" y="10">
</block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" movable="true" x="50" y="10">
</block>
</xml>`,
  `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" movable="true" x="50" y="10">
</block>
</xml>`,
];
export default a;
