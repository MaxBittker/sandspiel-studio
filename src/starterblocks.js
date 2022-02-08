export default `<xml xmlns="https://developers.google.com/blockly/xml">
<variables>
  <variable id="JGbX*aLh3=rkcy]PDaZ)">dx</variable>
</variables>
<block type="sand_behavior_base" id="bC9LUZ}BSdnWHY-T#Xw-" deletable="false" movable="false" x="150" y="10">
  <field name="Color">#ffaa77</field>
  <statement name="body">
    <block type="controls_ifelse" id="5:-U~W5:D=B4_5FUblC7">
      <value name="IF0">
        <block type="logic_compare" id="OkZdKMX=984=Jk3z2D.y">
          <field name="OP">EQ</field>
          <value name="A">
            <block type="get_cell" id="DdrJX!5hiK_u_*a|CU^6">
              <value name="x">
                <block type="math_number" id="8g@1qFnp^~=Cp15:z4xV">
                  <field name="NUM">0</field>
                </block>
              </value>
              <value name="y">
                <block type="math_number" id="f8jce/S/[x$Gvf.Ick6Y">
                  <field name="NUM">1</field>
                </block>
              </value>
            </block>
          </value>
          <value name="B">
            <block type="math_number" id="*^EJ65-Jv!ahEK2c3lcA">
              <field name="NUM">0</field>
            </block>
          </value>
        </block>
      </value>
      <statement name="DO0">
        <block type="set_cell" id="!:RJR$gp)VC,!Mma+U+C">
          <value name="x">
            <block type="math_number" id="o0i.r})#L[X:OGb(cyd!">
              <field name="NUM">0</field>
            </block>
          </value>
          <value name="y">
            <block type="math_number" id="lkh]T%d.A_DB7^1}Q$4#">
              <field name="NUM">0</field>
            </block>
          </value>
          <value name="cell">
            <block type="math_number" id="ppG6:z{{OZ^HUWfjx)wT">
              <field name="NUM">0</field>
            </block>
          </value>
          <next>
            <block type="set_cell" id="/r%~y}fC=69[=2m#y2Y6">
              <value name="x">
                <block type="math_number" id="A7L#okBS+;23n5Yf^UI0">
                  <field name="NUM">0</field>
                </block>
              </value>
              <value name="y">
                <block type="math_number" id="L@WvLrm)Pnt!+#MsD:dh">
                  <field name="NUM">1</field>
                </block>
              </value>
              <value name="cell">
                <block type="math_number" id="+qc~E{b4_OIG?$%O%*kO">
                  <field name="NUM">1</field>
                </block>
              </value>
            </block>
          </next>
        </block>
      </statement>
      <statement name="ELSE">
        <block type="variables_set" id="]JRY[J7B7dVWS2X7Q@D0">
          <field name="VAR" id="JGbX*aLh3=rkcy]PDaZ)">dx</field>
          <value name="VALUE">
            <block type="math_random_int" id="SKR9Kb1]/OCkeTI_lNa">
              <value name="FROM">
                <shadow type="math_number" id="11Qb6rh0e^l6ur5+WZM!">
                  <field name="NUM">-1</field>
                </shadow>
              </value>
              <value name="TO">
                <shadow type="math_number" id="D(uKKdQ:o5zC)hM@_k7N">
                  <field name="NUM">1</field>
                </shadow>
              </value>
            </block>
          </value>
          <next>
            <block type="controls_ifelse" id="5=?S;#i5^Hk%3yn0N/pk">
              <value name="IF0">
                <block type="logic_compare" id="}FU.OPl=!7x:hvX~8zA0">
                  <field name="OP">EQ</field>
                  <value name="A">
                    <block type="get_cell" id="fwV#mt|0A0Oit%zlkjlN">
                      <value name="x">
                        <block type="variables_get" id="SP?Q[Qkpkpx13ROH4{jh">
                          <field name="VAR" id="JGbX*aLh3=rkcy]PDaZ)">dx</field>
                        </block>
                      </value>
                      <value name="y">
                        <block type="math_number" id="%:T4m6Z9@jEm{Lm;0B]">
                          <field name="NUM">1</field>
                        </block>
                      </value>
                    </block>
                  </value>
                  <value name="B">
                    <block type="math_number" id="l2o|-7ik(|c!RC85_Xc+">
                      <field name="NUM">0</field>
                    </block>
                  </value>
                </block>
              </value>
              <statement name="DO0">
                <block type="set_cell" id="*(YJV9xbldj6v,}|!L@v">
                  <value name="x">
                    <block type="variables_get" id="4M62e?4nxu#xVjtqwiiH">
                      <field name="VAR" id="JGbX*aLh3=rkcy]PDaZ)">dx</field>
                    </block>
                  </value>
                  <value name="y">
                    <block type="math_number" id="uUyrcOIsL[y;fynvdsu~">
                      <field name="NUM">0</field>
                    </block>
                  </value>
                  <value name="cell">
                    <block type="math_number" id="(V93jvJAumQ+Y%^$fXm">
                      <field name="NUM">0</field>
                    </block>
                  </value>
                  <next>
                    <block type="set_cell" id="HF9=j-[R,-G3t1lQP+;">
                      <value name="x">
                        <block type="variables_get" id="R}njc?:FNPl=i9EB2ND2">
                          <field name="VAR" id="JGbX*aLh3=rkcy]PDaZ)">dx</field>
                        </block>
                      </value>
                      <value name="y">
                        <block type="math_number" id="=S?#Z:oLpXMW%rMJu%VN">
                          <field name="NUM">1</field>
                        </block>
                      </value>
                      <value name="cell">
                        <block type="math_number" id="V6T2|mlc+oq-YmcrhQSR">
                          <field name="NUM">1</field>
                        </block>
                      </value>
                    </block>
                  </next>
                </block>
              </statement>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </statement>
</block>
</xml>
   `;
