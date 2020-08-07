from flask import Flask, request
from flask_mysqldb import MySQL
import json, datetime
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
mysql = MySQL(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MYSQL_HOST'] = "localhost"
app.config['MYSQL_USER'] = "root"
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = "GlenDB"


@app.route('/cultdaily',methods=['GET', 'POST'])
@cross_origin()
def cultivationdaily():
      cur = mysql.connection.cursor()
      #d1 = "'2020-07-01'"
      #d2 = "'2020-07-14'"
      d1 = "'" + (str(request.args.get("start"))) + "'"
      d2 = "'" + (str(request.args.get("end"))) + "'"

      con = "FIELDENTRY.DATE, JOBTAB.JOB_NAME, SECTAB.SEC_NAME, SQUTAB.SQU_NAME"
      val = "MND_VAL, AREA_VAL"
      fom = "ROUND((MND_VAL/AREA_VAL),2)"
      con2 = "DIVTAB.DIV_NAME"
      tab = "FIELDENTRY,SQUTAB,JOBTAB,SECTAB,DIVTAB"
      joi = "FIELDENTRY.SQU_ID = SQUTAB.SQU_ID AND FIELDENTRY.JOB_ID=JOBTAB.JOB_ID AND FIELDENTRY.SEC_ID=SECTAB.SEC_ID AND DIVTAB.DIV_ID=SECTAB.DIV_ID"
      job = "(FIELDENTRY.JOB_ID = 2 or FIELDENTRY.JOB_ID = 3 or FIELDENTRY.JOB_ID = 4)"
      cur.execute(f'''select {con} , {val} , {fom} , {con2} from {tab} where {joi} and date >={d1} and date <={d2} and {job}''')
      rv = cur.fetchall()

      row_headers = ['Date', 'Job_Name', 'Section_Name', 'Squad_Name', 'Mandays', 'AreaCovered', 'Mnd/Area', 'Division']
      json_data = []

      def sids_converter(o):
            if isinstance(o, datetime.date):
                  return str(o.year) + str("/") + str(o.month) + str("/") + str(o.day)

      for result in rv:
            json_data.append(dict(zip(row_headers , result)))
      return json.dumps(json_data, default=sids_converter)


#2
@app.route('/cultgroup',methods=['GET', 'POST'])
@cross_origin()
def cultivationgroup():
      cur = mysql.connection.cursor()
      d1 = "'" + (str(request.args.get("start"))) + "'"
      d2 = "'" + (str(request.args.get("end"))) + "'"
      grp = "'" + (str(request.args.get("grpby"))) + "'"
      #d1 = "'2020-07-01'"
      #d2 = "'2020-07-14'"
      #grp = "section"

      if grp == "'job'":
            con = "JOBTAB.JOB_NAME"
            val = "sum(FIELDENTRY.MND_VAL)"
            val1 = "sum(FIELDENTRY.AREA_VAL)"
            fom = "ROUND((sum(FIELDENTRY.MND_VAL))/(sum(FIELDENTRY.AREA_VAL)),2)"
            tab = "FIELDENTRY,SQUTAB,JOBTAB,SECTAB,DIVTAB"
            joi = "FIELDENTRY.SQU_ID = SQUTAB.SQU_ID AND FIELDENTRY.JOB_ID=JOBTAB.JOB_ID AND FIELDENTRY.SEC_ID=SECTAB.SEC_ID AND DIVTAB.DIV_ID=SECTAB.DIV_ID"
            job = "(FIELDENTRY.JOB_ID = 2 or FIELDENTRY.JOB_ID = 3 or FIELDENTRY.JOB_ID = 4)"
            cur.execute(f'''select {con} , {val} , {val1} , {fom}  from {tab} where {joi} and date >={d1} and date <={d2} and {job} group by FIELDENTRY.JOB_ID''')
            rv = cur.fetchall()
            row_headers = ['Job_Name', 'Mandays', 'AreaCovered', 'MndArea']

      elif grp == "'section'":
            con = "SECTAB.SEC_NAME"
            val = "sum(FIELDENTRY.MND_VAL)"
            val1 = "sum(FIELDENTRY.AREA_VAL)"
            fom = "ROUND((SUM(FIELDENTRY.MND_VAL))/(SUM(FIELDENTRY.AREA_VAL)),2)"
            tab = "FIELDENTRY,SQUTAB,JOBTAB,SECTAB,DIVTAB"
            joi = "FIELDENTRY.SQU_ID = SQUTAB.SQU_ID AND FIELDENTRY.JOB_ID=JOBTAB.JOB_ID AND FIELDENTRY.SEC_ID=SECTAB.SEC_ID AND DIVTAB.DIV_ID=SECTAB.DIV_ID"
            cur.execute(f'''select {con} , {val} , {val1} , {fom}  from {tab} where {joi} and date >={d1} and date <={d2} group by FIELDENTRY.SEC_ID''')
            rv = cur.fetchall()
            row_headers = ['Section_Name', 'Mandays', 'AreaCovered', 'MndArea']

      json_data = []

      def sids_converter(o):
            if isinstance(o, datetime.date):
                  return str(o.year) + str("/") + str(o.month) + str("/") + str(o.day)

      for result in rv:
            json_data.append(dict(zip(row_headers,result)))
      return json.dumps(json_data, default=sids_converter)


#3
@app.route('/pluckdaily',methods=['GET', 'POST'])
@cross_origin()

def pluckingdaily():
      cur = mysql.connection.cursor()
      #d1 = "'2020-07-01'"
      #d2 = "'2020-07-02'"
      d1 = "'" + (str(request.args.get("start"))) + "'"
      d2 = "'" + (str(request.args.get("end"))) + "'"

      con = "fieldentry.date,SECTAB.SEC_NAME,SQUTAB.SQU_NAME"
      val = "FIELDENTRY.MND_VAL, FIELDENTRY.GL_VAL, FIELDENTRY.AREA_VAL"
      fom = "ROUND((GL_VAL/MND_VAL),2), ROUND((GL_VAL/AREA_VAL),2),ROUND((MND_VAL/AREA_VAL),2)"
      con2 = "DIVTAB.DIV_NAME, SECTAB.SEC_PRUNE , SECTAB.SEC_JAT, SECTAB.SEC_AREA"
      tab = "FIELDENTRY,SQUTAB,JOBTAB,SECTAB,DIVTAB"
      joi = "FIELDENTRY.SQU_ID = SQUTAB.SQU_ID AND FIELDENTRY.JOB_ID=JOBTAB.JOB_ID AND FIELDENTRY.SEC_ID=SECTAB.SEC_ID AND DIVTAB.DIV_ID=SECTAB.DIV_ID"
      job = "(FIELDENTRY.JOB_ID = 1 )"
      cur.execute(f'''select {con} , {val} , {fom} , {con2} from {tab} where {joi} and date >={d1} and date <={d2} and {job}''')

      row_headers = ['Date', 'Section_Name', 'Squad_Name', 'Mandays', 'Greenleaf', 'AreaCovered', 'GlMnd', 'GlHa', 'MndHa','Division','Prune','Jat', "SecArea"]
      rv = cur.fetchall()
      json_data = []

      def sids_converter(o):
            if isinstance(o, datetime.date):
                  return str(o.year) + str("/") + str(o.month) + str("/") + str(o.day)

      for result in rv:
            json_data.append(dict(zip(row_headers , result)))
      return json.dumps(json_data, default=sids_converter)


#4
@app.route('/pluckgroup',methods=['GET', 'POST'])
@cross_origin()

def pluckinggroup():
      cur = mysql.connection.cursor()
      d1 = "'" + (str(request.args.get("start"))) + "'"
      d2 = "'" + (str(request.args.get("end"))) + "'"
      grp = "'" + (str(request.args.get("grpby"))) + "'"
      #d1 = "'2020-07-01'"
      #grp = "Squad"

      if grp == "'Section'":
            con = "SECTAB.SEC_NAME"
            val = "sum(FIELDENTRY.MND_VAL), sum(FIELDENTRY.GL_VAL), sum(FIELDENTRY.AREA_VAL)"
            fom = "ROUND((sum(GL_VAL)/sum(MND_VAL)),2), ROUND((sum(GL_VAL)/sum(AREA_VAL)),2),ROUND((sum(MND_VAL)/sum(AREA_VAL)),2)"
            tab = "FIELDENTRY,SQUTAB,JOBTAB,SECTAB,DIVTAB"
            joi = "FIELDENTRY.SQU_ID = SQUTAB.SQU_ID AND FIELDENTRY.JOB_ID=JOBTAB.JOB_ID AND FIELDENTRY.SEC_ID=SECTAB.SEC_ID AND DIVTAB.DIV_ID=SECTAB.DIV_ID"
            job = "(FIELDENTRY.JOB_ID = 1 )"
            cur.execute(f'''select {con} , {val} , {fom} from {tab} where {joi} and date >={d1} and date <={d2} and {job} group by SECTAB.SEC_ID''')
            row_headers = ['Section_Name', 'Mandays', 'Greenleaf', 'AreaCovered', 'GLMnd', 'GLArea', 'MndArea']
            rv = cur.fetchall()

      if grp == "'Division'":
            con = "DIVTAB.DIV_NAME"
            val = "sum(FIELDENTRY.MND_VAL), sum(FIELDENTRY.GL_VAL), sum(FIELDENTRY.AREA_VAL)"
            fom = "ROUND((SUM(GL_VAL)/SUM(MND_VAL)),2), ROUND((sum(GL_VAL)/sum(AREA_VAL)),2),ROUND((SUM(MND_VAL)/SUM(AREA_VAL)),2)"
            # con2 = "DIVTAB.DIV_NAME, SECTAB.SEC_PRUNE , SECTAB.SEC_JAT"
            tab = "FIELDENTRY,SQUTAB,JOBTAB,SECTAB,DIVTAB"
            joi = "FIELDENTRY.SQU_ID = SQUTAB.SQU_ID AND FIELDENTRY.JOB_ID=JOBTAB.JOB_ID AND FIELDENTRY.SEC_ID=SECTAB.SEC_ID AND DIVTAB.DIV_ID=SECTAB.DIV_ID"
            job = "(FIELDENTRY.JOB_ID = 1 )"
            cur.execute(f'''select {con} , {val} , {fom} from {tab} where {joi} and date >={d1} and date <={d2} and {job} group by SECTAB.DIV_ID''')
            row_headers = ['Division', 'Mandays', 'Greenleaf', 'AreaCovered', 'GLMnd', 'GLArea', 'MndArea']
            rv = cur.fetchall()

      if grp == "'Squad'":
            con = "SQUTAB.SQU_NAME"
            val = "sum(FIELDENTRY.MND_VAL), sum(FIELDENTRY.GL_VAL), sum(FIELDENTRY.AREA_VAL)"
            fom = "ROUND((sum(GL_VAL)/sum(MND_VAL)),2), ROUND((sum(GL_VAL)/sum(AREA_VAL)),2),ROUND((sum(MND_VAL)/sum(AREA_VAL)),2)"
            tab = "FIELDENTRY,SQUTAB,JOBTAB,SECTAB,DIVTAB"
            joi = "FIELDENTRY.SQU_ID = SQUTAB.SQU_ID AND FIELDENTRY.JOB_ID=JOBTAB.JOB_ID AND FIELDENTRY.SEC_ID=SECTAB.SEC_ID AND DIVTAB.DIV_ID=SECTAB.DIV_ID"
            job = "(FIELDENTRY.JOB_ID = 1 )"
            cur.execute(f'''select {con} , {val} , {fom} from {tab} where {joi} and date >={d1} and date <={d2} and {job} group by SQUTAB.SQU_ID order by SQUTAB.SQU_NAME asc''')

            row_headers = ['Squad', 'Mandays', 'Greenleaf', 'AreaCovered', 'GLMnd', 'GLArea', 'MndArea']
            rv = cur.fetchall()

      json_data = []
      def sids_converter(o):
            if isinstance(o, datetime.date):
                  return str(o.year) + str("/") + str(o.month) + str("/") + str(o.day)

      for result in rv:
            json_data.append(dict(zip(row_headers, result)))
      return json.dumps(json_data, default=sids_converter)


#5
@app.route('/mnddeploy',methods=['GET', 'POST'])
@cross_origin()

def mandaydeployment():
      cur = mysql.connection.cursor()
      #d1 = "'" + (str(request.args.get("start"))) + "'"
      #d2 = "'" + (str(request.args.get("end"))) + "'"
      d1 = "'2020-07-01'"
      d2 = "'2020-07-04'"

      con = "JOBTAB.JOB_NAME"
      val = "SUM(FIELDENTRY.MND_VAL)"
      tab = "FIELDENTRY,JOBTAB"
      joi = "FIELDENTRY.JOB_ID=JOBTAB.JOB_ID"
      cur.execute(f'''select {con} , {val} from {tab} where {joi} and date >={d1} and date <={d2} group by FIELDENTRY.JOB_ID''')
      row_headers = ['Job_Name', 'Mandays']

      rv = cur.fetchall()
      json_data = []

      def sids_converter(o):
            if isinstance(o, datetime.date):
                  return str(o.year) + str("/") + str(o.month) + str("/") + str(o.day)

      for result in rv:
            json_data.append(dict(zip(row_headers, result)))
      return json.dumps(json_data, default=sids_converter)


#6
@app.route('/fuelreport',methods=['GET', 'POST'])
@cross_origin()

def fuelreport():
      cur = mysql.connection.cursor()
      d1 = "'" + (str(request.args.get("start"))) + "'"
      d2 = "'" + (str(request.args.get("end"))) + "'"
      #d1 = "'2020-07-01'"
      #d2 = "'2020-07-02'"

      con = " MACHINETAB.MACH_NAME"
      fom = " sum(FUELENTRY.FUEL_VAL), sum(TM_VAL), ROUND((SUM(TM_VAL)/sum(FUELENTRY.FUEL_VAL)),2)"
      tab = "FUELENTRY, MACHINETAB, FUELTAB, TMENTRY"
      joi = "FUELENTRY.FUEL_ID = FUELTAB.FUEL_ID AND FUELENTRY.MACH_ID = MACHINETAB.MACH_ID AND TMENTRY.TM_DATE = FUELENTRY.DATE"
      cur.execute(f'''select {con} , {fom}  from {tab} where {joi} and date >= {d1} and date <= {d2} group by MACHINETAB.MACH_NAME''')
      rv = cur.fetchall()

      row_headers = ['Machine', 'FuelUsed' , 'TM', 'TMFuel']
      json_data = []

      def sids_converter(o):
            if isinstance(o, datetime.date):
                  return str(o.year) + str("/") + str(o.month) + str("/") + str(o.day)

      for row in rv:
          json_data.append(dict(zip(row_headers,row)))
      return json.dumps(json_data, default=sids_converter)


#7
@app.route('/teastock',methods=['GET', 'POST'])
@cross_origin()

def teastock():
      cur = mysql.connection.cursor()
      # d1 = "'" + (str(request.args.get("start"))) + "'"
      d1 = "'2020-07-03'"

      con = "TEAGRADETAB.TEAGRADE_NAME, STOCKENTRY.KG_VAL"
      tab = "STOCKENTRY, TEAGRADETAB"
      joi = "(STOCKENTRY.TEAGRADE_ID = TEAGRADETAB.TEAGRADE_ID)"
      cur.execute(f'''select {con} from {tab} where {joi} and DATE = {d1}''')
      row_headers = ['Grade', 'Kg' ]
      rv = cur.fetchall()
      json_data = []

      def sids_converter(o):
            if isinstance(o, datetime.date):
                  return str(o.year) + str("/") + str(o.month) + str("/") + str(o.day)

      for result in rv:
            json_data.append(dict(zip(row_headers, result)))
      return json.dumps(json_data, default=sids_converter)


#8
@app.route('/teamade', methods=['GET', 'POST'])
@cross_origin()
def displayteamade():
    cur = mysql.connection.cursor()
    cur1 = mysql.connection.cursor()
    cur2 = mysql.connection.cursor()
    cur3 = mysql.connection.cursor()
    cur4 = mysql.connection.cursor()
    rv = []

    # d1 = "'" + (str(request.args.get("start"))) + "'"

    d0 = "'2020-03-01'"  # start date current year
    d00 = "'2019-03-01'"  # start date last year
    d1 = "'2020-07-03'"  # current date
    d11 = "'2019-07-02'"  # end date last year

    # [TM TODAY]
    val = "TMENTRY.TM_VAL "
    tab = "TMENTRY"
    cur.execute(f'''select {val} from {tab} where TM_DATE = {d1} ''')
    rv.append(cur.fetchall()[0][0])

    # [TM TODATE]
    val1 = "sum(TMENTRY.TM_VAL)"
    tab1 = "TMENTRY"
    cur1.execute(f'''select {val1} from {tab1} where TM_DATE >= {d0} AND TM_DATE <= {d1} ''')
    rv.append(cur1.fetchall()[0][0])

    # [TM TODATE LAST YEAR]
    val2 = "sum(TMENTRY.TM_VAL)"
    tab2 = "TMENTRY"
    cur2.execute(f'''select {val2} from {tab2} where TM_DATE >= {d00} AND TM_DATE <= {d11} ''')
    rv.append(cur2.fetchall()[0][0])

    # [RECOVERY % TODAY
    val3 = " ROUND(SUM(FIELDENTRY.GL_VAL)/SUM(TMENTRY.TM_VAL),4) * 100 "
    tab3 = "TMENTRY , FIELDENTRY"
    joi3 = "(TMENTRY.TM_DATE = FIELDENTRY.DATE) and (TMENTRY.TM_DATE="
    cur3.execute(f'''select {val3} from {tab3} where {joi3}{d1})''')
    rv.append(cur3.fetchall()[0][0])

    # [RECOVERY % TO DATE
    val4 = " ROUND(SUM(FIELDENTRY.GL_VAL)/SUM(TMENTRY.TM_VAL),4) * 100 "
    tab4 = 'TMENTRY , FIELDENTRY'
    joi4 = "(TMENTRY.TM_DATE = FIELDENTRY.DATE) and (TMENTRY.TM_DATE>="
    cur4.execute(f'''select {val4} from {tab4} where {joi4}{d0}) and (TMENTRY.TM_DATE<={d1})''')
    rv.append(cur4.fetchall()[0][0])

    def sids_converter(o):
        if isinstance(o, datetime.date):
            return str(o.year) + str("/") + str(o.month) + str("/") + str(o.day)

    column_headers = ['TM Today', 'TM Todate', 'TM Todate LY', 'Recovery % Today', 'Recovery% Todate']
    json_data = []
    json_data.append(dict(zip(column_headers, rv)))
    return json.dumps(json_data, default=sids_converter)


#9##
@app.route('/GL',methods=['GET', 'POST'])
@cross_origin()

def greenleaf():
      cur = mysql.connection.cursor()
      cur1 = mysql.connection.cursor()
      cur2 = mysql.connection.cursor()
      cur3 = mysql.connection.cursor()
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
      cur1.execute(f'''select {val1} from {tab1} where {joi1} AND {job1} and date = {d1} GROUP BY SECTAB.DIV_ID''')
      rv1 = cur1.fetchall()

      #GL TODAY LAST YEA1R
      val2 = "SUM(FIELDENTRY.GL_VAL)"
      tab2 = "FIELDENTRY, DIVTAB, SECTAB"
      joi2 = "(FIELDENTRY.SEC_ID=SECTAB.SEC_ID) AND (SECTAB.DIV_ID = DIVTAB.DIV_ID)"
      job2 = "FIELDENTRY.JOB_ID = 1"
      cur2.execute(f'''select {val2} from {tab2} where {joi2} AND {job2} and date = {d11} GROUP BY SECTAB.DIV_ID''')
      rv2 = cur2.fetchall()

      #FINE LEAF% TODAYS GL
      val3 = "sum(FL_PER)"
      tab3 = "FLENTRY, DIVTAB"
      joi3 = "(FLENTRY.DIV_ID = DIVTAB.DIV_ID)"
      cur3.execute(f'''select {val3} from {tab3} where {joi3} and date = {d2} GROUP BY DIVTAB.DIV_ID''')
      rv3 = cur3.fetchall()

      w = [i[0] for i in rv]
      x = [i1[0] for i1 in rv1]
      y = [i2[0] for i2 in rv2]
      z = [i3[0] for i3 in rv3]
      
      q = zip(w,x,y,z)
      json_data = []
      column_headers = ['Division','GL Today','GL Today LY','FineLeaf%']

      for row in q:
            json_data.append(dict(zip(column_headers, row)))
      return json.dumps(json_data)



#10##
@app.route('/gradeper',methods=['GET', 'POST'])
@cross_origin()

def gradepercent():
      cur = mysql.connection.cursor()
      cur1 = mysql.connection.cursor()
      cur2 = mysql.connection.cursor()
      # d1 = "'" + (str(request.args.get("start"))) + "'"
      # d2 = "'" + (str(request.args.get("end"))) + "'"
      d1 = "'2020-07-01'"
      d2 = "'2020-07-03'"

      cur.execute(f"SELECT SUM(SORTENTRY.SORT_KG) FROM SORTENTRY WHERE date >={d1} and date <={d2} ")
      rv = cur.fetchall()

      cur1.execute(f"SELECT SUM(SORTENTRY.SORT_KG) FROM SORTENTRY, TEAGRADETAB WHERE SORTENTRY.TEAGRADE_ID = TEAGRADETAB.TEAGRADE_ID and date >={d1} and date <={d2} group by TEAGRADETAB.TEAGRADE_NAME ")
      rv1 = cur1.fetchall()

      cur2.execute(f"SELECT TEAGRADETAB.TEAGRADE_NAME FROM SORTENTRY, TEAGRADETAB WHERE SORTENTRY.TEAGRADE_ID = TEAGRADETAB.TEAGRADE_ID and date >={d1} and date <={d2} group by TEAGRADETAB.TEAGRADE_NAME ")
      rv2 = cur2.fetchall()

      x = [s[0] for s in rv]
      y = [i[0] for i in rv1]
      w = [str(u[0]) for u in rv2]

      z = []
      for number in y:
            z.append((round((number / x[0]),2)*100))

      zz = zip(w,y,z)

      json_data = []    
      column_headers = ('Grade','Qnty','Percent')

      for row in zz:
            json_data.append(dict(zip(column_headers,row)))
      return json.dumps(json_data)

      
#11
@app.route('/invoicelist',methods=['GET', 'POST'])
@cross_origin()

def invoicelist():
      cur = mysql.connection.cursor()

      con = "INVOICEENTRY.INVOICE_NO, TEAGRADETAB.TEAGRADE_NAME"
      val = "INVOICEENTRY.NET_WT , INVOICEENTRY.PAPERSACKS, INVOICEENTRY.PACKDATE,INVOICEENTRY.DISPATCHDATE"
      tab = "INVOICEENTRY,TEAGRADETAB"
      joi = "INVOICEENTRY.TEAGRADE_ID=TEAGRADETAB.TEAGRADE_ID"
      cur.execute(f'''select {con} , {val} from {tab} where {joi}''')
      row_headers = ['InvNo','Grade', 'NetWt','Papersacks','Packdate','DispatchDate']
      rv = cur.fetchall()
      json_data = []

      def sids_converter(o):
            if isinstance(o, datetime.date):
                  return str(o.year) + str("/") + str(o.month) + str("/") + str(o.day)

      for result in rv:
            json_data.append(dict(zip(row_headers, result)))
      return json.dumps(json_data, default=sids_converter)



    
#5test
@app.route('/mnddeploy1',methods=['GET', 'POST'])
@cross_origin()

def mandaydeployment1():
      cur = mysql.connection.cursor()
      cur1 = mysql.connection.cursor()
      d1 = "'2020-07-01'"
      d2 = "'2020-07-04'"

      con = "JOBTAB.JOB_NAME"
      val = "SUM(FIELDENTRY.MND_VAL)"
      tab = "FIELDENTRY,JOBTAB"
      joi = "FIELDENTRY.JOB_ID=JOBTAB.JOB_ID"
      cur.execute(f'''select {con} , {val} from {tab} where {joi} and date >={d1} and date <={d2} group by FIELDENTRY.JOB_ID''')
      row_headers = ['Job_Name', 'Mandays']

      rv = cur.fetchall()
      json_data = []

      for result in rv:
            json_data.append(dict(zip(row_headers, result)))
     
      
      con1 = "TEAGRADETAB.TEAGRADE_NAME, STOCKENTRY.KG_VAL"
      tab1 = "STOCKENTRY, TEAGRADETAB"
      joi1 = "(STOCKENTRY.TEAGRADE_ID = TEAGRADETAB.TEAGRADE_ID)"
      cur1.execute(f'''select {con1} from {tab1} where {joi1} and DATE = {d1}''')
      row_headers1 = ['Grade', 'Kg' ]
      rv1 = cur1.fetchall()
      json_data1 = []


      for result in rv1:
            json_data1.append(dict(zip(row_headers1, result)))
      
      jso = {}
      jso['a'] = json_data
      jso['b'] = json_data1

      return json.dumps(jso)
            


      
      

if __name__ == "__main__":
    app.run(debug=True)
