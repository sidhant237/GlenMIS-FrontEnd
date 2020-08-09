#9m
@app.route('/email', methods=['GET', 'POST'])
@cross_origin()
def email():
      cur = mysql.connection.cursor()
      # d1 = "'" + (str(request.args.get("start"))) + "'"
      # d11 = "'" + (str(request.args.get("end"))) + "'"
      d1 = "'2020-07-01'"
      d11 = "'2019-07-01'"
      d2 = "'2020-07-03'"

      #DIV NAME
      val = "DIVTAB.DIV_NAME"
      tab = "DIVTAB, SECTAB, FIELDENTRY"
      joi = "(FIELDENTRY.SEC_ID=SECTAB.SEC_ID) AND (SECTAB.DIV_ID = DIVTAB.DIV_ID)"
      job = "FIELDENTRY.JOB_ID = 1"
      cur.execute(f'''select {val} from {tab} where {joi} AND {job} and date = {d1} GROUP BY SECTAB.DIV_ID''')
      rv = cur.fetchall()

      # GL TODAY
      val1 = "SUM(FIELDENTRY.GL_VAL)"
      tab1 = "DIVTAB, SECTAB, FIELDENTRY"
      joi1 = "(FIELDENTRY.SEC_ID=SECTAB.SEC_ID) AND (SECTAB.DIV_ID = DIVTAB.DIV_ID)"
      job1 = "FIELDENTRY.JOB_ID = 1"
      cur.execute(f'''select {val1} from {tab1} where {joi1} AND {job1} and date = {d1} GROUP BY SECTAB.DIV_ID''')
      rv1 = cur.fetchall()

      #GL TODAY LAST YEA1R
      val2 = "SUM(FIELDENTRY.GL_VAL)"
      tab2 = "FIELDENTRY, DIVTAB, SECTAB"
      joi2 = "(FIELDENTRY.SEC_ID=SECTAB.SEC_ID) AND (SECTAB.DIV_ID = DIVTAB.DIV_ID)"
      job2 = "FIELDENTRY.JOB_ID = 1"
      cur.execute(f'''select {val2} from {tab2} where {joi2} AND {job2} and date = {d11} GROUP BY SECTAB.DIV_ID''')
      rv2 = cur.fetchall()

      #FINE LEAF% TODAYS GL
      val3 = "sum(FL_PER)"
      tab3 = "FLENTRY, DIVTAB"
      joi3 = "(FLENTRY.DIV_ID = DIVTAB.DIV_ID)"
      cur.execute(f'''select {val3} from {tab3} where {joi3} and date = {d2} GROUP BY DIVTAB.DIV_ID''')
      rv3 = cur.fetchall()

      w = [i[0] for i in rv]
      x = [i1[0] for i1 in rv1]
      y = [i2[0] for i2 in rv2]
      z = [i3[0] for i3 in rv3]
      
      q = zip(w,x,y,z)
      json_data = []
      column_headers = ['Division','GL Today','GL Today LY','FineLeaf%']

      for row in q:
            json_data.append(dict(zip(column_headers, row)))
      


#8m
      cur = mysql.connection.cursor()
      rva = []

      # d1 = "'" + (str(request.args.get("start"))) + "'"

      d0 = "'2020-03-01'"  # start date current year
      d00 = "'2019-03-01'"  # start date last year
      d1 = "'2020-07-03'"  # current date
      d11 = "'2019-07-02'"  # end date last year

      # [TM TODAY]
      vala = "TMENTRY.TM_VAL "
      taba = "TMENTRY"
      cur.execute(f'''select {vala} from {taba} where TM_DATE = {d1} ''')
      rva.append(cur.fetchall()[0][0])

      # [TM TODATE]
      vala1 = "sum(TMENTRY.TM_VAL)"
      taba1 = "TMENTRY"
      cur.execute(f'''select {vala1} from {taba1} where TM_DATE >= {d0} AND TM_DATE <= {d1} ''')
      rva.append(cur.fetchall()[0][0])

      # [TM TODATE LAST YEAR]
      vala2 = "sum(TMENTRY.TM_VAL)"
      taba2 = "TMENTRY"
      cur.execute(f'''select {vala2} from {taba2} where TM_DATE >= {d00} AND TM_DATE <= {d11} ''')
      rva.append(cur.fetchall()[0][0])

      # [RECOVERY % TODAY
      vala3 = " ROUND(SUM(FIELDENTRY.GL_VAL)/SUM(TMENTRY.TM_VAL),4) * 100 "
      taba3 = "TMENTRY , FIELDENTRY"
      joia3 = "(TMENTRY.TM_DATE = FIELDENTRY.DATE) and (TMENTRY.TM_DATE="
      cur.execute(f'''select {vala3} from {taba3} where {joia3}{d1})''')
      rva.append(cur.fetchall()[0][0])

      # [RECOVERY % TO DATE
      vala4 = " ROUND(SUM(FIELDENTRY.GL_VAL)/SUM(TMENTRY.TM_VAL),4) * 100 "
      taba4 = 'TMENTRY , FIELDENTRY'
      joia4 = "(TMENTRY.TM_DATE = FIELDENTRY.DATE) and (TMENTRY.TM_DATE>="
      cur.execute(f'''select {vala4} from {taba4} where {joia4}{d0}) and (TMENTRY.TM_DATE<={d1})''')
      rva.append(cur.fetchall()[0][0])


      column_headers = ['TM Today', 'TM Todate', 'TM Todate LY', 'Recovery % Today', 'Recovery% Todate']
      json_data1 = []
      json_data1.append(dict(zip(column_headers, rv)))


    #10m

      cur = mysql.connection.cursor()
      # d1 = "'" + (str(request.args.get("start"))) + "'"
      # d2 = "'" + (str(request.args.get("end"))) + "'"
      d1 = "'2020-07-01'"
      d2 = "'2020-07-03'"

      cur.execute(f"SELECT SUM(SORTENTRY.SORT_KG) FROM SORTENTRY WHERE date >={d1} and date <={d2} ")
      rvb = cur.fetchall()

      cur.execute(f"SELECT SUM(SORTENTRY.SORT_KG) FROM SORTENTRY, TEAGRADETAB WHERE SORTENTRY.TEAGRADE_ID = TEAGRADETAB.TEAGRADE_ID and date >={d1} and date <={d2} group by TEAGRADETAB.TEAGRADE_NAME ")
      rvb1 = cur.fetchall()

      cur.execute(f"SELECT TEAGRADETAB.TEAGRADE_NAME FROM SORTENTRY, TEAGRADETAB WHERE SORTENTRY.TEAGRADE_ID = TEAGRADETAB.TEAGRADE_ID and date >={d1} and date <={d2} group by TEAGRADETAB.TEAGRADE_NAME ")
      rvb2 = cur.fetchall()

      xb = [s[0] for s in rvb]
      yb = [i[0] for i in rvb1]
      wb = [str(u[0]) for u in rvb2]

      zb = []
      for number in yb:
            zb.append((round((number / x[0]),2)*100))

      zz = zip(wb,yb,zb)

      json_data2 = []    
      column_headers = ('Grade','Qnty','Percent')

      for row in zz:
            json_data2.append(dict(zip(column_headers,row)))
      

#5m

      cur = mysql.connection.cursor()
      
      conc = "JOBTAB.JOB_NAME"
      valc = "SUM(FIELDENTRY.MND_VAL)"
      tabc = "FIELDENTRY,JOBTAB"
      joic = "FIELDENTRY.JOB_ID=JOBTAB.JOB_ID"
      cur.execute(f'''select {conc} , {valc} from {tabc} where {joic} and date >={d1} and date <={d2} group by FIELDENTRY.JOB_ID''')
      row_headers = ['Job_Name', 'Mandays']

      rvc = cur.fetchmany(5)
      json_data3 = []

      for result in rvc:
            json_data3.append(dict(zip(row_headers, result)))
      

      json_submit = {}
      json_submit['Greenleaf'] = json_data
      json_submit['Tea Made'] = json_data1
      json_submit['Grade Percent'] = json_data2
      json_submit['Mandays'] = json_data3
      return json.dumps(json_submit)