#!/bin/sh

export HOME="/home/root"

mkdir -p /home/root >/dev/null 2>&1

DIR=$(dirname ${0})

if [ -z "${1}" ]; then
	exit 0
fi

if [ -e /tmp/papctl-lock ]; then
	exit 0
fi

case ${1} in
	reset)
		touch /tmp/papctl-lock

		COUNT="0";

		while [ ${COUNT} -lt 15 ]; do
			${DIR}/papctl "C ${COUNT} 0 0"

			let COUNT="${COUNT} + 1"
		done

		if [ -e "/tmp/papctl-listen" ]; then
			CUR_LISTEN=$(cat /tmp/papctl-listen)

			/usr/bin/pactl unload-module ${CUR_LISTEN}
		fi

		if [ -e "/tmp/papctl-module" ]; then
			CUR_MODULE=$(cat /tmp/papctl-module)

			/usr/bin/pactl unload-module ${CUR_MODULE}
		fi

		sleep 2

		rm -f /tmp/papctl-listen
		rm -f /tmp/papctl-module
		rm -f /tmp/papctl-server
		rm -f /tmp/papctl-vsinks
		;;

	connect)
		if [ -z "${2}" ]; then
			exit 1
		fi

		touch /tmp/papctl-lock

		SERVER="${2}" ; VSINKS="${3}"

		CUR_SERVER="" ; CUR_MODULE="" ; CUR_VSINKS=""

		if [ -e "/tmp/papctl-server" ]; then
			CUR_SERVER=$(cat /tmp/papctl-server)
		fi

		if [ -e "/tmp/papctl-module" ]; then
			CUR_MODULE=$(cat /tmp/papctl-module)
		fi

		if [ -e "/tmp/papctl-vsinks" ]; then
			CUR_VSINKS=$(cat /tmp/papctl-vsinks)
		fi

		if [ "${SERVER}" != "${CUR_SERVER}" ]; then
			echo "${SERVER}" >/tmp/papctl-server

			if [ -e "/tmp/papctl-vsinks" ]; then
				cat /tmp/papctl-vsinks | sed s/","/"\n"/g >/tmp/papctl-list

				cat /tmp/papctl-list | while read SINK ; do
					NO=""

					case ${SINK} in
						palerts) NO="0" ;;
						pnotifications) NO="1" ;;
						pfeedback) NO="2" ;;
						pringtones) NO="3" ;;
						pmedia) NO="4" ;;
						pflash) NO="5" ;;
						pnavigation) NO="6" ;;
						pvoicedial) NO="7" ;;
						pvvm) NO="8" ;;
						pvoip) NO="9" ;;
						pdefaultapp) NO="10" ;;
						peffects) NO="11" ;;
						pDTMF) NO="12" ;;
						pcalendar) NO="13" ;;
						palarm) NO="14" ;;
					esac

					if [ ! -z "${NO}" ]; then
						${DIR}/papctl "C ${NO} 0 0"
					fi
				done
			fi

			sleep 1

			if [ -e "/tmp/papctl-module" ]; then
				/usr/bin/pactl unload-module ${CUR_MODULE}

				sleep 2
			fi

			/usr/bin/pactl load-module module-tunnel-sink server=${SERVER} sink_name=wifi >/tmp/papctl-module

			if [ "${?}" == "0" ]; then
				sleep 5

				/usr/bin/pactl list | grep -q "wifi"

				if [ "${?}" == "0" ]; then
					echo ${VSINKS} >/tmp/papctl-vsinks

					echo ${VSINKS} | sed s/","/"\n"/g >/tmp/papctl-list

					cat /tmp/papctl-list | while read SINK ; do
						NO=""

						case ${SINK} in
							palerts) NO="0" ;;
							pnotifications) NO="1" ;;
							pfeedback) NO="2" ;;
							pringtones) NO="3" ;;
							pmedia) NO="4" ;;
							pflash) NO="5" ;;
							pnavigation) NO="6" ;;
							pvoicedial) NO="7" ;;
							pvvm) NO="8" ;;
							pvoip) NO="9" ;;
							pdefaultapp) NO="10" ;;
							peffects) NO="11" ;;
							pDTMF) NO="12" ;;
							pcalendar) NO="13" ;;
							palarm) NO="14" ;;
						esac

						if [ ! -z "${NO}" ]; then
							${DIR}/papctl "O ${NO} 2 0"
						fi
					done
				else
					echo "Connection error"

					CUR_MODULE=$(cat /tmp/papctl-module)

					/usr/bin/pactl unload-module ${CUR_MODULE}

					sleep 2

					rm -f /tmp/papctl-module
					rm -f /tmp/papctl-server
					rm -f /tmp/papctl-vsinks
				fi
			else
				echo "Module load error"

				rm -f /tmp/papctl-module
				rm -f /tmp/papctl-server
				rm -f /tmp/papctl-vsinks
			fi
		elif [ "${VSINKS}" != "${CUR_VSINKS}" ]; then
			if [ -e "/tmp/papctl-vsinks" ]; then
				cat /tmp/papctl-vsinks | sed s/","/"\n"/g >/tmp/papctl-list

				cat /tmp/papctl-list | while read SINK ; do
					NO=""

					case ${SINK} in
						palerts) NO="0" ;;
						pnotifications) NO="1" ;;
						pfeedback) NO="2" ;;
						pringtones) NO="3" ;;
						pmedia) NO="4" ;;
						pflash) NO="5" ;;
						pnavigation) NO="6" ;;
						pvoicedial) NO="7" ;;
						pvvm) NO="8" ;;
						pvoip) NO="9" ;;
						pdefaultapp) NO="10" ;;
						peffects) NO="11" ;;
						pDTMF) NO="12" ;;
						pcalendar) NO="13" ;;
						palarm) NO="14" ;;
					esac

					if [ ! -z "${NO}" ]; then
						${DIR}/papctl "C ${NO} 0 0"
					fi
				done
			fi

			echo ${VSINKS} >/tmp/papctl-vsinks

			echo ${VSINKS} | sed s/","/"\n"/g >/tmp/papctl-list

			cat /tmp/papctl-list | while read SINK ; do
				NO=""

				case ${SINK} in
					palerts) NO="0" ;;
					pnotifications) NO="1" ;;
					pfeedback) NO="2" ;;
					pringtones) NO="3" ;;
					pmedia) NO="4" ;;
					pflash) NO="5" ;;
					pnavigation) NO="6" ;;
					pvoicedial) NO="7" ;;
					pvvm) NO="8" ;;
					pvoip) NO="9" ;;
					pdefaultapp) NO="10" ;;
					peffects) NO="11" ;;
					pDTMF) NO="12" ;;
					pcalendar) NO="13" ;;
					palarm) NO="14" ;;
				esac

				if [ ! -z "${NO}" ]; then
					${DIR}/papctl "O ${NO} 2 0"
				fi
			done
		fi
		;;

	disconnect)
		touch /tmp/papctl-lock

		if [ -e "/tmp/papctl-vsinks" ]; then
			cat /tmp/papctl-vsinks | sed s/","/"\n"/g >/tmp/papctl-list

			cat /tmp/papctl-list | while read SINK ; do
				NO=""

				case ${SINK} in
					palerts) NO="0" ;;
					pnotifications) NO="1" ;;
					pfeedback) NO="2" ;;
					pringtones) NO="3" ;;
					pmedia) NO="4" ;;
					pflash) NO="5" ;;
					pnavigation) NO="6" ;;
					pvoicedial) NO="7" ;;
					pvvm) NO="8" ;;
					pvoip) NO="9" ;;
					pdefaultapp) NO="10" ;;
					peffects) NO="11" ;;
					pDTMF) NO="12" ;;
					pcalendar) NO="13" ;;
					palarm) NO="14" ;;
				esac

				if [ ! -z "${NO}" ]; then
					${DIR}/papctl "C ${NO} 0 0"
				fi
			done
		fi

		if [ -e "/tmp/papctl-module" ]; then
			CUR_MODULE=$(cat /tmp/papctl-module)

			/usr/bin/pactl unload-module ${CUR_MODULE}

			sleep 2

			rm -f /tmp/papctl-module
			rm -f /tmp/papctl-server
			rm -f /tmp/papctl-vsinks
		fi
		;;

	enable)
		touch /tmp/papctl-lock

		if [ ! -e "/tmp/papctl-listen" ]; then
			/usr/bin/pactl load-module module-native-protocol-tcp auth-anonymous=1 >/tmp/papctl-listen

			sleep 2
		fi
		;;

	disable)
		touch /tmp/papctl-lock

		if [ -e "/tmp/papctl-listen" ]; then
			CUR_LISTEN=$(cat /tmp/papctl-listen)

			/usr/bin/pactl unload-module ${CUR_LISTEN}

			rm -f /tmp/papctl-listen

			sleep 2
		fi
		;;
esac

rm -f /tmp/papctl-list >/dev/null 2>&1
rm -f /tmp/papctl-lock >/dev/null 2>&1

exit 0