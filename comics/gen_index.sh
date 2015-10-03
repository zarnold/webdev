#/bin/sh
# Your comics folder structure should be like :
# - ./bdd/sharable/<SERIE_NAME>/<EPISODE_NAME>/
# - image in this folder
# Your images should be named in alphabetical order aka a.jpg, b.jpg, c.jpg,...

# -- ERROR CODE
E_BDD_INVALID=2
E_UNSPECIFIED=1

# ===== DEBUG and Helpers ====
printLog ()
{
  now=$(date +%Y%m%d_%H%M%S)
    echo "[+] [${now}] -- $@">>$LOG_PATH
    echo "[+] [${now}] -- $@"
}

printError ()
{
  now=$(date +%Y%m%d_%H%M%S)
  echo "[X] [${now}] [ERROR] -- $@">>$LOG_PATH
  echo "[X] [${now}] [ERROR] -- $@"
}

checkOption ()
{
# -- OPTION DEFAULT VALUE
O_HUMAN_READABLE=FALSE
O_VERBOSE=1
  printLog "Checking options $@"

    while getopts “rv:” OPTION
    do
      case $OPTION in
      r)
        O_HUMAN_READABLE=TRUE
        ;;
      v)
        O_VERBOSE=$OPTARG
        ;;
      esac
    done  

printLog "Human Readable : ${O_HUMAN_READABLE}"
printLog "Verbose : ${O_VERBOSE}"
}
# ===== JSON Syntax related =====

putJson ()
{
  printf "$@" >> ${INDEX_PATH}
}


initiateJson ()
{
  putJson '{'
}

initiateArray ()
{
  putJson '['
}

closeArray ()
{
  putJson ']'
}

initiateObject()
{
  putJson '{'
}

closeObject ()
{
  putJson '}'
}
closeJson ()
{
  putJson '}'
}

putSeparator ()
{
  putJson ','
  if [ "$O_HUMAN_READABLE" == "TRUE" ] 
  then
    putJson '\n'
  fi
}

sanitizeJson ()
{
  sed -i -e 's/,]/]\n/g' -e 's/,}/}\n/g' ${INDEX_PATH}
  sed -i -e '$s/,$//' ${INDEX_PATH}
  sed -i -e 's/}{/},\n{/g' ${INDEX_PATH}
  sed -i -e 's/\[/[\n/g' ${INDEX_PATH}
}


# ===== Index Builder ====

extractInfos ()
{
  authors=( spunch )
  infoFile=${BDD_PATH}/${serie}/${episode}/infos.txt 

  if [ -f ${infoFile} ]
  then
    #  Clean
    printLog "Found info file in ${infoFile}"
    sed -i -e 's/ //g' ${infoFile}

    authors=( $(cat ${infoFile} | grep [aA]ut[eh][uo]r | cut -d ":" -f 2 |sed 's/,/ /g') )
    printLog "Authors are ${authors}"
  else
    printError "info File not found in ${infoFile}. Using default"
  fi
          

  putJson "\"authors\":"
  initiateArray
  for author in "${authors[@]}"
  do
    printLog "Creating folder for ${author}"
    [ ! -d ${BDD_PATH}/../authors/${author} ] && mkdir ${BDD_PATH}/../authors/${author}
    ln -sfT  ${BDD_PATH}/${serie}/${episode} ${BDD_PATH}/../authors/${author}/${serie}-${episode} 
    initiateObject
    putJson "\"nom\": \"${author}\""
    closeObject
    putSeparator
  done
  closeArray
}

buildSerie ()
{

for abs_serie in ${BDD_PATH}/*
do
  printLog "now in ${abs_serie}"
  if [ -d "${abs_serie}" ]
  then
      extractName ${abs_serie}
      serie=${NAME}


      INDEX_PATH=${BDD_PATH}/${serie}/index.json
      [ -f ${BDD_PATH}/${serie}/index.json ] && rm ${BDD_PATH}/${serie}/index.json
      [ -f ${BDD_PATH}/${serie}/index.txt ] && rm ${BDD_PATH}/${serie}/index.txt

      hr_serie=$(echo ${serie^} |sed -e  's/[-_]/ /g')
      initiateObject
      printLog "Serie was $NAME and now is $hr_serie"
      putJson "\"nom\": \"${hr_serie}\""
      putSeparator
      putJson "\"slug\": \"${serie}\""
      putSeparator
      putJson "\"episodes\":" 
      initiateArray

      buildEpisodes
    
      INDEX_PATH=${BDD_PATH}/${serie}/index.json
      closeArray
      closeObject
      sanitizeJson
    
      
      cat ${BDD_PATH}/${serie}/index.txt >> ${BDD_PATH}/index.json
   else
      printError "${serie} is not a folder"
   fi
done

}


buildEpisodes ()
{

      for abs_episode in ${BDD_PATH}/${serie}/*
      do
        if [ -d "${abs_episode}" ]
        then
          extractName ${abs_episode}
          episode=$NAME
          hr_ep=$(echo ${episode^} |sed -e 's/\+//g' -e  's/[-_]/ /g')

          INDEX_PATH=${BDD_PATH}/${serie}/${episode}/index.json
          [ -f ${BDD_PATH}/${serie}/${episode}/index.json ] && rm ${BDD_PATH}/${serie}/${episode}/index.json
          [ -f ${BDD_PATH}/${serie}/${episode}/index.txt ] && rm ${BDD_PATH}/${serie}/${episode}/index.txt

          initiateObject
          extractInfos
          putSeparator
          putJson "\"serie\": \"${hr_serie}\""
          putSeparator
          putJson "\"episode\": \"${hr_ep}\""
          putSeparator
          putJson "\"episodeslug\": \"${episode}\""
          putSeparator
          putJson "\"slug\": \"${serie}\""
          putSeparator

#Le tableau des cases
          putJson "\"cases\":"
          initiateArray
          
          for abs_image in ${BDD_PATH}/${serie}/${episode}/{*.jpg,*.gif,*.png}
          do
              extractName ${abs_image}
              image=$NAME
#Warn  :globbing pritn stars if no file found
              if [[ ! "${image}" =~ \*.* ]]
              then
                initiateObject
                # reaplce with your own server url 
                putJson "\"url\": \"http://my_server.com/${lang_folder}/${serie}/${episode}/${image}\""

                closeObject
                putSeparator
              fi
          done

          closeArray

          closeObject
          putSeparator

          sanitizeJson
          printLog "Puttin ${INDEX_PATH} to  ${BDD_PATH}/${serie}/index.json"

#valid json
          cat ${INDEX_PATH} >> ${BDD_PATH}/${serie}/index.json
# List only
          cat ${INDEX_PATH} >> ${BDD_PATH}/${serie}/index.txt
        fi
      done

}

extractName ()
{
  #TODO = filter name for valid url

  NAME=$(printf $@ | sed 's/^.*\///g')

}
#------------------------------------------------------

printLog "Starting Index Generation"

checkOption  $@

do_gen()
{
INDEX_PATH="${BDD_PATH}/index.json"

printLog "Discarding ${INDEX_PATH}"

if [ -f ${INDEX_PATH} ]
then
  printLog "Already an old index, moving it"
  mv ${INDEX_PATH} ${INDEX_PATH}.previous
fi

#rm -rf ${BDD_PATH}/../authors/*

printLog "Checking the BDD"
if [ ! -d ${BDD_PATH} ] 
then
  printError "${BDD_PATH} is not a valid BDD for spunch maker"
  printError "Leaving mutafuckaz"
  exit ${E_BDD_INVALID}
fi


printLog "Building Catalog"
initiateJson

putJson "\"series\":" 
initiateArray
buildSerie
INDEX_PATH="${BDD_PATH}/index.json"
closeArray
closeJson
sanitizeJson

gen_authors
}

printLog "Generate index"
lang_folder="sharable"
BDD_PATH="./bdd/sharable"
do_gen
